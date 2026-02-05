import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME || "interviewai",
  process.env.DB_USER || "postgres",
  process.env.DB_PASS || "",
  {
    host: process.env.DB_HOST || "127.0.0.1",
    port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
    dialect: "postgres",
    logging: false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

// Import model definitions
import defineUser from "../models/sql/User.js";
import defineInstitution from "../models/sql/Institution.js";
import defineSubscription from "../models/sql/Subscription.js";
import defineInterviewSession from "../models/sql/InterviewSession.js";
import defineInterviewAttempt from "../models/sql/InterviewAttempt.js";
import defineAdmin from "../models/sql/Admin.js";

const User = defineUser(sequelize, DataTypes);
const Institution = defineInstitution(sequelize, DataTypes);
const Subscription = defineSubscription(sequelize, DataTypes);
const InterviewSession = defineInterviewSession(sequelize, DataTypes);
const InterviewAttempt = defineInterviewAttempt(sequelize, DataTypes);
const Admin = defineAdmin(sequelize, DataTypes);

// Associations (simple)
Institution.hasMany(User, { foreignKey: "institutionId" });
User.belongsTo(Institution, { foreignKey: "institutionId" });

// Export sequelize instance and models
export { sequelize, User as UserSQL, Institution as InstitutionSQL, Subscription as SubscriptionSQL, InterviewSession as InterviewSessionSQL, InterviewAttempt as InterviewAttemptSQL, Admin as AdminSQL };

export default sequelize;
