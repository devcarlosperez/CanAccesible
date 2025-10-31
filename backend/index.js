const express = require("express");
const { sequelize } = require('./models');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('./routes/incidence.routes')(app);

app.get("/", (req, res) => {
  res.send("Hola mundo");
});

const env = process.env.NODE_ENV;

// Verify database connection at startup
sequelize
  .authenticate()
  .then(() => console.log(`Successful mysql connection: env=${env}`))
  .catch((err) => console.error("Error", err));

// Use environment variable for port or default to 8080
const port = process.env.port || 85;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
