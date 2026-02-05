export default (sequelize, DataTypes) => {
  const InterviewSession = sequelize.define(
    "InterviewSession",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
      userId: { type: DataTypes.INTEGER, allowNull: false },
      domain: { type: DataTypes.STRING },
      language: { type: DataTypes.STRING },
      salaryRange: { type: DataTypes.JSONB, defaultValue: {} },
      questions: { type: DataTypes.JSONB, defaultValue: [] },
      currentQuestionIndex: { type: DataTypes.INTEGER, defaultValue: 0 },
      completed: { type: DataTypes.BOOLEAN, defaultValue: false },
      transcriptLocked: { type: DataTypes.BOOLEAN, defaultValue: false },
      finalReport: { type: DataTypes.JSONB, defaultValue: {} },
    },
    { tableName: "interview_sessions", timestamps: true },
  );

  return InterviewSession;
};
