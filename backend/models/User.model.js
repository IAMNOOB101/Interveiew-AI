import { UserSQL } from "../db/sequelize.js";

const normalize = (instance) => {
  if (!instance) return null;
  const obj = instance.get ? instance.get({ plain: true }) : instance;
  // Mongo-like _id for compatibility
  if (obj.id) obj._id = obj.id;
  return obj;
};

export default {
  findOne: async (filter) => {
    const where = { ...filter };
    const r = await UserSQL.findOne({ where });
    return normalize(r);
  },
  create: async (data) => {
    const r = await UserSQL.create(data);
    return normalize(r);
  },
  findById: async (id) => {
    const r = await UserSQL.findByPk(id);
    return normalize(r);
  },
  findByIdAndUpdate: async (id, update) => {
    await UserSQL.update(update, { where: { id } });
    const r = await UserSQL.findByPk(id);
    return normalize(r);
  },
  findOneAndUpdate: async (filter, update) => {
    await UserSQL.update(update, { where: { ...filter } });
    const r = await UserSQL.findOne({ where: { ...filter } });
    return normalize(r);
  },
  countDocuments: async (filter = {}) => {
    return UserSQL.count({ where: { ...filter } });
  },
};
