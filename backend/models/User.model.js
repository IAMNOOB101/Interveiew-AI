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
  { timestamps: true }
);
//User model schema
export default mongoose.model("User", userSchema);
