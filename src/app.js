const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const morgan = require("morgan");
const cors = require("cors");
const createError = require("http-errors");
const dotenv = require("dotenv");
const connectDB = require("./helpers/init_mongodb.js");
const userRoute = require("./routes/userRoutes");
const statRoute = require("./routes/statRoute");
const communityRoute = require("./routes/community");
const eventRoute = require("./routes/event");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(cors());

app.use("/api", userRoute, statRoute, communityRoute, eventRoute);

// app.use("/api");
// // Fallback route for undefined routes
// app.use(async (req, res, next) => {
//   next(createError.NotFound("This route does not exist"));
// });

// Error handling middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

module.exports = app;
