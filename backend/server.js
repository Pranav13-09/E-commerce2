const app = require("./app");
const Port = process.env.PORT || 80;
const dotenv = require("dotenv");
const cloudinary = require("cloudinary");

dotenv.config({ path: "backend/config/config.env" });

process.on("uncaughtException", (err) => {
  console.log(`Error : ${err.msg}`);
  console.log("shutting down the server due to uncaught exception");
  app.close(() => {
    process.exit(1);
  });
});

const connection = require("./config/database");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
  api_key: process.env.CLOUDINARY_API_KEY,
});

connection();
app.listen(Port, () => {
  console.log(`listening on port ${Port}`);
});

// process.on("unhandledRejection", (err) => {
//   console.log(`Error : ${err.msg}`);
//   console.log("shutting down the server due to unhandled promise rejection");
//   app.close(() => {
//     process.exit(1);
//   });
// });
