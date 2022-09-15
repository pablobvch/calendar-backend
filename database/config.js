const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    console.log("DB online");
  } catch (error) {
    console.log(error);
    throw new Error("Error to initialize the database");
  }
};

module.exports = {
  dbConnection
};
