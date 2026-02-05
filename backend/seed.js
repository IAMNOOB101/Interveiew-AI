import sequelize from "./db/sequelize.js";
import bcrypt from "bcryptjs";
import { UserSQL, AdminSQL } from "./db/sequelize.js";

const seedSuperAdmin = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    // Check if super-admin already exists
    const existingAdmin = await AdminSQL.findOne({ where: { roleLevel: "super-admin" } });
    if (existingAdmin) {
      console.log("Super-admin already exists.");
      return;
    }

    // Create super-admin user
    const hashedPassword = await bcrypt.hash("SuperAdmin123!", 10); // Change this password!
    const user = await UserSQL.create({
      name: "Super Admin",
      email: "admin@interviewai.com",
      password: hashedPassword,
      accountType: "admin",
      role: "admin",
    });

    // Create admin record
    await AdminSQL.create({
      userId: user.id,
      roleLevel: "super-admin",
      permissions: ["all"],
    });

    console.log("Super-admin seeded successfully. Email: admin@interviewai.com, Password: SuperAdmin123!");
  } catch (error) {
    console.error("Seeding failed:", error);
  } finally {
    await sequelize.close();
  }
};

seedSuperAdmin();