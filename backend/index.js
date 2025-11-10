const path = require("path");
const dotenv = require("dotenv");

const env = process.env.NODE_ENV || "development";
const envPath = path.resolve(__dirname, `.env.${env}`);
dotenv.config({ path: envPath });

console.log("JWT_SECRET:", process.env.JWT_SECRET);

const express = require("express");
const { sequelize } = require("./models");

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require("./routes/incident.routes")(app);
require("./routes/user.routes")(app);
require("./routes/notification.routes")(app);
require("./routes/auth.routes")(app);

sequelize
  .authenticate()
  .then(() => console.log(`Successful mysql connection: env=${env}`))
  .catch((err) => console.error("Error", err));

const port = process.env.PORT || 85;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
