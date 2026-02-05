import { InterviewSessionSQL } from "../db/sequelize.js";

const normalize = (instance) => {
  if (!instance) return null;
  const obj = instance.get ? instance.get({ plain: true }) : instance;
  if (obj.id) obj._id = obj.id;
  return obj;
};

const toSessionObject = (instance) => {
  const plain = normalize(instance);
  if (!plain) return null;

  // Provide .save() to mimic mongoose documents
  plain.save = async function () {
    const id = this._id || this.id;
    const copy = { ...this };
    delete copy.save;
    delete copy._id;
    await InterviewSessionSQL.update(copy, { where: { id } });
    const refreshed = await InterviewSessionSQL.findByPk(id);
    return toSessionObject(refreshed);
  };

  return plain;
};

export default {
  findOne: async (filter = {}) => {
    const r = await InterviewSessionSQL.findOne({ where: { ...filter } });
    return toSessionObject(r);
  },
  findById: async (id) => {
    const r = await InterviewSessionSQL.findByPk(id);
    return toSessionObject(r);
  },
  create: async (data) => {
    const r = await InterviewSessionSQL.create(data);
    return toSessionObject(r);
  },
  findOneAndUpdate: async (filter, update) => {
    await InterviewSessionSQL.update(update, { where: { ...filter } });
    const r = await InterviewSessionSQL.findOne({ where: { ...filter } });
    return toSessionObject(r);
  },
  findByIdAndUpdate: async (id, update) => {
    await InterviewSessionSQL.update(update, { where: { id } });
    const r = await InterviewSessionSQL.findByPk(id);
    return toSessionObject(r);
  },
  find: async (filter = {}) => {
    const rows = await InterviewSessionSQL.findAll({ where: { ...filter } });
    return rows.map((r) => normalize(r));
  },
  countDocuments: async (filter = {}) => {
    return InterviewSessionSQL.count({ where: { ...filter } });
  },
  // Basic aggregate emulation for common pipelines used in admin.controller
  aggregate: async (pipeline = []) => {
    const matchStage = pipeline.find((p) => p.$match);
    const groupStage = pipeline.find((p) => p.$group);
    const sortStage = pipeline.find((p) => p.$sort);

    let where = {};
    if (matchStage && matchStage.$match) {
      where = { ...matchStage.$match };
      // remove nested JSON dot queries like 'finalReport.finalScore'
      delete where["finalReport.finalScore"];
    }

    const rows = await InterviewSessionSQL.findAll({ where });
    const plainRows = rows.map((r) => r.get ? r.get({ plain: true }) : r);

    if (groupStage && groupStage.$group) {
      const groupBy = groupStage.$group._id;
      const groupOps = groupStage.$group;

      const groups = {};
      plainRows.forEach((row) => {
        const key = groupBy === "$domain" ? row.domain : row[groupBy];
        if (!groups[key]) groups[key] = [];
        groups[key].push(row);
      });

      const results = Object.keys(groups).map((key) => {
        const groupRows = groups[key];
        const result = { _id: key };
        if (groupOps.count) result.count = groupRows.length;
        if (groupOps.avgScore) {
          const scores = groupRows
            .map((x) => x.finalReport && x.finalReport.finalScore)
            .filter((s) => typeof s === "number");
          result.avgScore = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
        }
        return result;
      });

      if (sortStage && sortStage.$sort) {
        const sortKey = Object.keys(sortStage.$sort)[0];
        const sortOrder = sortStage.$sort[sortKey];
        results.sort((a, b) => (sortOrder === -1 ? b[sortKey] - a[sortKey] : a[sortKey] - b[sortKey]));
      }

      return results;
    }

    if (groupStage && groupStage.$group && groupStage.$group.avgScore) {
      const scores = plainRows
        .map((x) => x.finalReport && x.finalReport.finalScore)
        .filter((s) => typeof s === "number");
      const avg = scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0;
      return [{ avgScore: avg }];
    }

    return plainRows;
  },
};
