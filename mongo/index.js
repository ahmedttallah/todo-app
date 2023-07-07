// Packages
const mongoose = require("mongoose");
const chalk = require("chalk");

module.exports = {
  mongoConnection: async () => {
    await mongoose
      .connect(
        "mongodb://" +
          process.env.MONGO_HOST +
          "/" +
          process.env.MONGO_DB
      )

      .then(() =>
        console.log(
          chalk.bgGreen.bold(
            `[OK] Connected to MongoDB on ${process.env.MONGO_HOST} `
          )
        )
      )
      .catch((err) =>
        console.log(
          chalk.bgRed.bold(`[ERR] Connection to MongoDB failed: ${err} `)
        )
      );
  }, // MongoDB Connection
};
