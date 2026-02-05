import app from "./app.js";
import dotenv from "dotenv";
import sequelize from "./db/sequelize.js";

dotenv.config();

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const startServer = async () => {
  const maxRetries = 10;
  let attempt = 0;

  while (attempt < maxRetries) {
    try {
      await sequelize.authenticate();
      await sequelize.sync();
      console.log("Postgres (Sequelize) connected and synced");

      app.listen(process.env.PORT || 4000, () => {
        console.log(`Server running on ${process.env.PORT || 4000}`);
      });
      return;
    } catch (err) {
      attempt += 1;
      console.error(`DB connection failed (attempt ${attempt}/${maxRetries}):`, err.message || err);
      if (attempt >= maxRetries) {
        console.error("Max DB connection attempts reached. Exiting.");
        process.exit(1);
      }
      console.log("Retrying DB connection in 3 seconds...");
      // wait before retrying
      // eslint-disable-next-line no-await-in-loop
      await wait(3000);
    }
  }
};

startServer();
