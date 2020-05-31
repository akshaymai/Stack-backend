require("dotenv").config();
const morgan=require('morgan')
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My routes
const authRoutes = require("./Router/auth");
const userRoutes = require("./Router/user");
const categoryRoutes = require("./Router/category");
const bookRouter = require("./Router/book");
const issuebookRouter = require("./Router/bokissue");

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan('tiny'))

//My Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", bookRouter);
app.use("/api", issuebookRouter);

//PORT
const port = process.env.PORT || 8000;

//Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});