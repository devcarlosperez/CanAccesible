const express = require("express")
const sequelize = require("./db");

const app = express()

app.use(express.json())

app.use(express.urlencoded({ extended: true}))

app.get("/", (req, res) => {
  res.send("Hola mundo")
})

sequelize.authenticate()
  .then(() => console.log("Successful mysql connection"))
  .catch(err => console.error("Error", err));

const port = process.env.port || 8080
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`)
})