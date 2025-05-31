const express = require("express");
const app = express();

const jwt = require("jsonwebtoken");
const { secretKey, userToValidate } = require("./auth.js");
const verifyToken = require("./verifyToken.js");
const bodyParser = require("body-parser");

const { connectToMongoDB, disconnectFromMongoDB } = require("./mongodb.js");
const PORT = process.env.PORT || 3008;

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Content-type", "application/json; charset=utf-8"); // tenia "," en "/json," --> error: {invalida media type}
  next();
});

// login de usuario, para generar su JWT
app.post("/login", (req, res) => {
  const usuarios = userToValidate;
  const username = req.body.username;
  const password = req.body.password;
  console.log(
    "Datos recibidos: Usuario: " + username + " Password: " + password
  );
  const usuario_consultado = usuarios.find(
    (user) => user.username === username
  );

  if (usuario_consultado) {
    if (password === usuario_consultado.password) {
      const token = jwt.sign({ username: username }, secretKey, {
        expiresIn: "1h",
      });
      res.json({ token: token });
    } else {
      res.status(401).json({ error: "Contraseña inválida" });
    }
  } else {
    res.status(401).json({ error: "Usuario no encontrado" });
  }
});

app.get("/rutaProtegida", verifyToken, (req, res, next) => {
  const username = req.decoded.username;
  res.json({ mensaje: "Hola " + username + " ,esta ruta esta protegida" });

  next();
});
app.get("/", (req, res) => {
  res.status(200).end("<h1> Bienvenidos a la API de frutas RESTful </h1>");
});

app.get("/frutas", async (req, res) => {
  const client = await connectToMongoDB();
  if (!client) {
    res.status(500).send("Error al conectarse a MongoDB");
    return;
  }
  const db = client.db("frutas");
  const frutas = await db.collection("frutas").find().toArray();

  await disconnectFromMongoDB();
  res.json(frutas);
});

app.get("/frutas/:id", async (req, res) => {
  const id_buscado = parseInt(req.params.id) || 0; // guardo el parámetro a buscar, que se guarda en Int o 0 si no existe o no lo encuentra

  const client = await connectToMongoDB();
  if (!client) {
    res.status(500).send("Error al conectarse a MongoDB");
    return;
  }
  const db = client.db("frutas");
  const fruta = await db.collection("frutas").findOne({ id: id_buscado });

  await disconnectFromMongoDB();
  res.json(fruta);
});

//http://localhost:3008/frutas/nombre/:nombre
app.get("/frutas/nombre/:nombre", async (req, res) => {
  const client = await connectToMongoDB();
  if (!client) {
    res.status(500).send("Error al conectarse a MongoDB");
    return;
  }
  const nombre_buscado = req.params.nombre.trim().toLocaleLowerCase();

  //.find({ nombre: { $regex: nombre_buscado, $options: "i" } }) // otra forma de usar RegExp
  const db = client.db("frutas");
  const frutas_por_nombre = await db
    .collection("frutas")
    .find({ nombre: new RegExp(nombre_buscado, "i") })
    .toArray();

  if (frutas_por_nombre.length === 0) {
    res.json({
      error: 404,
      message:
        "La búsqueda de la fruta que incluya en su nombre " +
        nombre_buscado +
        " no arrojo resultados",
    });
  } else {
    res.json(frutas_por_nombre);
  }
  await disconnectFromMongoDB();
});

//http://localhost:3008/frutas/precio/:precio
app.get("/frutas/precio/:precio", async (req, res) => {
  const client = await connectToMongoDB();
  if (!client) {
    res.status(500).send("Error al conectarse a MongoDB");
    return;
  }
  const importe_buscado = parseInt(req.params.precio) || 0; // si precio isNaN, va 0 y muestra todas las frutas
  const db = client.db("frutas");

  const frutas_por_precio = await db
    .collection("frutas")
    .find({ importe: { $gte: importe_buscado } })
    .toArray();

  if (frutas_por_precio.length === 0) {
    res.json({
      error: 404,
      message:
        "La búsqueda de frutas con importe mayor o igual que " +
        importe_buscado +
        " no arrojo resultados",
    });
  } else {
    res.send(frutas_por_precio);
  }
  await disconnectFromMongoDB();
});

//http://localhost:3008/frutas
app.post("/frutas", async (req, res) => {
  const nuevosDatos = req.body;
  if (nuevosDatos === undefined) {
    return res.status(400).send("El formato de datos es erróneo o inválido");
  }
  const client = await connectToMongoDB();
  if (!client) {
    return res.status(500).send("Error al conectarse con MongoDB");
  }

  const collection = client.db("frutas").collection("frutas");
  collection
    .insertOne(nuevosDatos)
    .then(() => {
      console.log("Nueva Fruta creada");
      res.status(201).send(nuevosDatos);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      client.close();
    });
});
//http://localhost:3008/frutas
app.put("/frutas/:id", async (req, res) => {
  const id_buscado = parseInt(req.params.id);
  const nuevosDatos = req.body;
  if (!nuevosDatos) {
    return res.status(400).send("El formato de datos es erróneo o inválido");
  }
  const client = await connectToMongoDB();
  if (!client) {
    return res.status(500).send("Error al conectarse con MongoDB");
  }

  const collection = client.db("frutas").collection("frutas");
  collection
    .updateOne({ id: id_buscado }, { $set: nuevosDatos })
    .then(() => {
      console.log("Fruta modificada");
      res.status(200).send(nuevosDatos);
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .send("Error al intentar modificar la fruta con el id: ", id_buscado);
    })
    .finally(() => {
      client.close();
    });
});

//http://localhost:3008/frutas/id
app.delete("/frutas/:id", async (req, res) => {
  const id_buscado = req.params.id;
  if (!id_buscado) {
    return res.status(400).send("El formato de datos es erróneo o inválido");
  }
  const client = await connectToMongoDB();
  if (!client) {
    return res.status(500).send("Error al conectarse con MongoDB");
  }

  client
    .connect()
    .then(() => {
      const collection = client.db("frutas").collection("frutas");
      return collection.deleteOne({ id: parseInt(id_buscado) });
    })
    .then((resultado) => {
      if (resultado.deletedCount === 0) {
        res
          .status(404)
          .send("No se encontro fruta con el id proporcionado: ", id_buscado);
      } else {
        console.log("fruta eliminada");
        res.status(204).send();
      }
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .send("Error al intentar eliminar la fruta con el id: ", id_buscado);
    })
    .finally(() => {
      client.close();
    });
});

app.use((req, res) => {
  // para manejar rutas inexistentes
  res.status(404).send("Lo siento, la página buscada no existe");
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
