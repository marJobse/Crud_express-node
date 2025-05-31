require("dotenv").config();
const secretKey = process.env.SECRET_KEY;
//const userToValidate = { username: "Mariana", password: "mi_clave" };
const userToValidate = [
  { username: "Uno", password: "clave1" },
  { username: "Dos", password: "clave2" },
  { username: "Tres", password: "clave3" },
  { username: "Cuatro", password: "clave4" },
];
module.exports = { secretKey, userToValidate };
