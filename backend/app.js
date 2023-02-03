const express = require("express");
const app = express();
const errorMiddleware = require("./middleware/error");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
require("express-async-errors");
app.use(express.json({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(fileUpload());

dotenv.config({ path: "backend/config/config.env" });

const product = require("./routes/ProductRoutes");
const user = require("./routes/UserRoutes");
const payment = require("./routes/PaymentRoutes");
const order = require("./routes/OrderRoutes");

app.use("/", product);
app.use("/user", user);
app.use("/payment", payment);
app.use("/order", order);
app.use(errorMiddleware);
module.exports = app;
