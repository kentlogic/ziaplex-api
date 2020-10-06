const app = express();
const cors = require("cors");
const knex = require("knex");

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
  res.json({ code: 200, message: `Working.` });
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