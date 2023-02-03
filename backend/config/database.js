const mongoose = require("mongoose");

const URL =
  "mongodb+srv://pranav:loginform@cluster0.rshhz.mongodb.net/Ecommerce?retryWrites=true&w=majority";

const connection = () => {
  mongoose
    .connect(`${URL}`, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log("connected to database");
    })
    .catch((err) => {
      console.log("error connecting the database");
      console.log(err);
    });
};

module.exports = connection;
