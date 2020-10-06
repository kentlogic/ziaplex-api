//view multiple Users
const handleUsersQuery = (req, res, db) => {
    db.select("*")
      .from("users")
      .orderBy("firstname", "lastname")
      .then((user) => {
        if (user.length) {
          res.json(user);
        } else {
          res.json({ code: 404, message: "No Users." });
        }
      })
      .catch((err) =>
        res.json({ code: 400, message: `Invalid parameter. ${err}` })
      );
};

//for login
const handleUserLogin = (req, res, db) => {
  const { email, password } = req.body;
   console.log(`Email ${email}  Password ${password}`)
  db.select("*")
    .from("users")
    .where({ email })
     .then((user) => {
       if(user.length > 0) {
         //email / username was found on DB
        if (user[0].password===password) {
          //Email and password match 
          res.json({ code: 200, message: `Welcome back ${user[0].firstname}!` });
        } else {
          //Incorrect password
          res.json({ code: 404, message: "Incorrect username or password." });
        }
      } else {
        //No email/username found
        res.json({ code: 404, message: "Account does not exist." });
      }
    })

    .catch((err) =>
      res.json({ code: 400, message: `Invalid parameter. ${err}` })
    );
};

// delete a user - will not implement for now
// const handleUserDelete = (req, res, db) => {
//   const uid = req.params.uid;
//   db.transaction((trx) => {
//     trx
//       .delete()
//       .from("Users")
//       .where({ uid })
//       .returning("name")
//       .then((name) =>
//         res.json({ code: 200, message: `${name} has been deleted` })
//       )
//       .then(trx.commit)
//       .catch(trx.rollback);
//   }).catch((err) => res.status(400).json({ code: 400, message: `${err}` }));
// };

//add a user
const handleUserRegister = (req, res, db) => {
  const {  email, password, firstname, middlename, lastname, mobile, address, type } = req.body;
  //For logging
  console.log(req.body);
  if ( !email || !password || !firstname || !middlename || !lastname || !mobile || !address || !type) {
    return res.json({
      code: 400,
      message: "Unable to register.",
    });
  }

  db.transaction((trx) => {
    trx
      .insert({
        email: email,
        password: password,
        firstname: firstname,
        middlename: middlename, 
        lastname: lastname, 
        mobile: mobile, 
        address: address, 
        type: type,
        status: 1,
        date: new Date(),
      })
      .into("users")
      .returning("firstname")
      .then((firstname) =>
        res.json({ code: 201, message: `Welcome ${firstname}!` })
      )
      .then(trx.commit)
      .catch(trx.rollback);
  }).catch((err) => res.status(400).json({ code: 400, message: `${err}` }));
};

module.exports = {
  handleUserRegister: handleUserRegister,
  handleUserLogin: handleUserLogin,
  handleUsersQuery: handleUsersQuery,
};
