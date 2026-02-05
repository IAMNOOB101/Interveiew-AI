export default (sequelize, DataTypes) => {
  const Institution = sequelize.define(
    "Institution",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: DataTypes.STRING, allowNull: false, unique: true },
      allowedDomains: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
      perStudentPrice: { type: DataTypes.FLOAT, defaultValue: 0 },
      studentLimit: { type: DataTypes.INTEGER, defaultValue: 0 },
      studentsRegistered: { type: DataTypes.INTEGER, defaultValue: 0 },
      approvalStatus: { type: DataTypes.STRING, defaultValue: "PENDING" },
      subscriptionValidTill: { type: DataTypes.DATE, allowNull: true },
    },
    { tableName: "institutions", timestamps: true },
  );

  return Institution;
};
