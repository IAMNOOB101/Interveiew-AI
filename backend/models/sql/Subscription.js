export default (sequelize, DataTypes) => {
  const Subscription = sequelize.define(
    "Subscription",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: true },
      institutionId: { type: DataTypes.INTEGER, allowNull: true },
      plan: { type: DataTypes.STRING },
      providerId: { type: DataTypes.STRING },
      status: { type: DataTypes.STRING, defaultValue: "ACTIVE" },
      validTill: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "subscriptions", timestamps: true },
  );

  return Subscription;
};
