const express = require("express");
const path = require("path");
const { sequelize } = require("./models");
const session = require("express-session");

const app = express();

// Set view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Add CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SequelizeStore = require("connect-session-sequelize")(session.Store);
const sessionStore = new SequelizeStore({
  db: sequelize,
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000,
      secure: false,
      httpOnly: true,
      sameSite: 'lax'
    },
  })
);

// Dashboard admin routes (before API routes)
require("./routes/dashboardAdmin.views.routes")(app);

// API routes
require("./routes/incident.routes")(app);
require("./routes/user.routes")(app);
require("./routes/notification.routes")(app);
require("./routes/auth.routes")(app);
require("./routes/blogArticle.routes")(app);
require("./routes/conversation.routes")(app);
require("./routes/conversationMessage.routes")(app);
require("./routes/log.routes")(app);

const env = process.env.NODE_ENV;

// Verify database connection at startup
sequelize
  .authenticate()
  .then(() => console.log(`Successful mysql connection: env=${env}`))
  .catch((err) => console.error("Error", err));

// Sync the session store to create the Sessions table if it doesn't exist
sessionStore.sync();

// Use environment variable for port or default to 8080
const port = 85;
app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});
