export default (sequelize, DataTypes) => {
  const Admin = sequelize.define(
    "Admin",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      roleLevel: { type: DataTypes.STRING, defaultValue: "support-admin" },
      permissions: { type: DataTypes.JSONB, defaultValue: [] },
      createdBy: { type: DataTypes.INTEGER, allowNull: true },
    },
    { tableName: "admins", timestamps: true },
  );

  return Admin;
};
