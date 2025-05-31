const jwt = require("jsonwebtoken");
const { secretKey } = require("./auth");

function verifyToken(req, res, next) {
  const token = req.headers["authorization"] || null;
  if (token) {
    jwt.verify(token, secretKey, (err, decoded) => {
      err
        ? res.status(401).json({ error: "Token inválido" })
        : (req.decoded = decoded);
      next();
    });
  } else {
    res.status(401).json({ error: "Token no proporcionado " });
  }
}

module.exports = verifyToken;
