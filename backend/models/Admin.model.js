import { AdminSQL } from "../db/sequelize.js";

const normalize = (instance) => {
  if (!instance) return null;
  const obj = instance.get ? instance.get({ plain: true }) : instance;
  if (obj.id) obj._id = obj.id;
  return obj;
};

export default {
  create: async (data) => {
    const r = await AdminSQL.create(data);
    return normalize(r);
  },
  findOne: async (filter) => {
    const r = await AdminSQL.findOne({ where: { ...filter } });
    return normalize(r);
  },
};
