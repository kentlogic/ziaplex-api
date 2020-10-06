const express = require("express");
const app = express();
const cors = require("cors");
const knex = require("knex");
const expressip = require("express-ip");

app.use(expressip().getIpInfoMiddleware);
//Controllers
const users = require("./controllers/user");
 
//Workaround for Error: self signed certificate
//or code: 'DEPTH_ZERO_SELF_SIGNED_CERT' for the free tier
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: 'pg',
  connection: {
    connectionString : process.env.DATABASE_URL,
    ssl: true
  }
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  const ipInfo = req.ipInfo;
  console.log(req.ipInfo);
  res.json({ code: 100, message: `${ipInfo.city}, ${ipInfo.country}` });
});

app.get("/users", (req, res) => {
  users.handleUsersQuery(req, res, db);
});


app.post("/user/login", (req, res) => {
  users.handleUserLogin(req, res, db);
});

app.post("/user/register", (req, res) => {
  users.handleUserRegister(req, res, db);
});


app.put("/user", (req, res) => {
  users.handleProjectUpdate(req, res, db);
});


app.listen(process.env.PORT || 5001, () => {
  console.log(`App is listening on port 5001`);
});

process.on("unhandledRejection", (err) => {
  console.error(err); 
});