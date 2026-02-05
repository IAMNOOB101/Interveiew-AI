export default (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: { type: DataTypes.STRING },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING },
      role: { type: DataTypes.STRING, defaultValue: "professional" },
      accountType: { type: DataTypes.STRING, defaultValue: "guest", index: true },
      interviewProfile: { type: DataTypes.JSONB, defaultValue: {} },
      interviewCount: { type: DataTypes.INTEGER, defaultValue: 0 },
      institutionId: { type: DataTypes.INTEGER, allowNull: true },
      resumeData: { type: DataTypes.JSONB, defaultValue: {} },
      audioHistory: { type: DataTypes.JSONB, defaultValue: [] },
    },
    {
      tableName: "users",
      timestamps: true,
    },
  );

  return User;
};
