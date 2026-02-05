import { InterviewAttemptSQL } from "../db/sequelize.js";

const normalize = (instance) => {
  if (!instance) return null;
  const obj = instance.get ? instance.get({ plain: true }) : instance;
  if (obj.id) obj._id = obj.id;
  return obj;
};

export default {
  create: async (data) => {
    const r = await InterviewAttemptSQL.create(data);
    return normalize(r);
  },
  findOne: async (filter) => {
    const r = await InterviewAttemptSQL.findOne({ where: { ...filter } });
    return normalize(r);
  },
  find: async (filter = {}) => {
    const rows = await InterviewAttemptSQL.findAll({ where: { ...filter } });
    return rows.map((r) => normalize(r));
  },
};
