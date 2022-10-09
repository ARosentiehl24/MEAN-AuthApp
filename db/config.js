const mongoose = require("mongoose");

const dbConnection = () => {
  try {
    mongoose.connect(process.env.CONNECTION_STRING, {});

    console.log("DataBase online");
  } catch (error) {
    console.log(error);
    throw new Error("Error when try to init database");
  }
};

module.exports = {
  dbConnection,
};
