import { InstitutionSQL } from "../db/sequelize.js";

const normalize = (instance) => {
  if (!instance) return null;
  const obj = instance.get ? instance.get({ plain: true }) : instance;
  if (obj.id) obj._id = obj.id;
  return obj;
};

export default {
  findOne: async (filter) => {
    // Special handling when querying by allowedDomains (search domain inside JSONB array)
    if (filter && filter.allowedDomains) {
      const domain = filter.allowedDomains;
      // Respect approvalStatus if provided
      const where = {};
      if (filter.approvalStatus) where.approvalStatus = filter.approvalStatus;
      const candidates = await InstitutionSQL.findAll({ where });
      const found = candidates.find((c) => {
        const arr = c.get ? c.get({ plain: true }).allowedDomains : c.allowedDomains;
        return Array.isArray(arr) && arr.includes(domain);
      });
      return normalize(found);
    }

    const r = await InstitutionSQL.findOne({ where: { ...filter } });
    return normalize(r);
  },
  findOneAndUpdate: async (filter, update) => {
    await InstitutionSQL.update(update, { where: { ...filter } });
    const r = await InstitutionSQL.findOne({ where: { ...filter } });
    return normalize(r);
  },
  findByIdAndUpdate: async (id, update) => {
    await InstitutionSQL.update(update, { where: { id } });
    const r = await InstitutionSQL.findByPk(id);
    return normalize(r);
  },
  create: async (data) => {
    const r = await InstitutionSQL.create(data);
    return normalize(r);
  },
  find: async (filter = {}) => {
    const rows = await InstitutionSQL.findAll({ where: { ...filter } });
    return rows.map((r) => normalize(r));
  },
};
