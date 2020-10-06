const express = require("express");
const app = express();
const cors = require("cors");
const knex = require("knex");
const expressip = require("express-ip");

app.use(expressip().getIpInfoMiddleware);
//Controllers
const users = require("./controllers/user");
const messages = require("./controllers/message");
const blogs = require("./controllers/blog");
const profile = require("./controllers/profile");
//Workaround for Error: self signed certificate
//or code: 'DEPTH_ZERO_SELF_SIGNED_CERT' for the free tier
process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const db = knex({
  client: "pg",
  connection: {
   database: "ziaplex",
   host : '127.0.0.1',
   user : 'kentlogic',
   password : 'kent123',
  },
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
 

process.on("unhandledRejection", (err) => {
  console.error(err); 
});