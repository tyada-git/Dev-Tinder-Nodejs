const mongoose = require("mongoose");

const connectDB = async () => {
  return mongoose.connect(
    "mongodb+srv://tanushreeadsyadav_db_user:xDDI3J7G6k1mhOGB@nodedb.wdgloz0.mongodb.net/devTinder"
  );
};

module.exports = connectDB;
