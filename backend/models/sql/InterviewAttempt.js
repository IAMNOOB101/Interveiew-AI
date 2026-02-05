export default (sequelize, DataTypes) => {
  const InterviewAttempt = sequelize.define(
    "InterviewAttempt",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      domain: { type: DataTypes.STRING },
      language: { type: DataTypes.STRING },
      salaryRange: { type: DataTypes.JSONB, defaultValue: {} },
      question: { type: DataTypes.TEXT },
      answer: { type: DataTypes.TEXT },
      evaluation: { type: DataTypes.JSONB, defaultValue: {} },
    },
    { tableName: "interview_attempts", timestamps: true },
  );

  return InterviewAttempt;
};
