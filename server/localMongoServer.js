const express = require("express");
const { MongoClient } = require("mongodb");

const app = express();
app.use(express.json());

const PORT = Number(process.env.LOCAL_API_PORT || 4000);
const MONGO_URI = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.LOCAL_MONGO_DB || "AgroApp";
const USERS_COLLECTION = process.env.LOCAL_MONGO_USERS_COLLECTION || "usuarios";

let usersCollection;

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "agroapp-local-mongo-api" });
});

app.post("/api/users", async (req, res) => {
  if (!usersCollection) {
    return res.status(503).json({ message: "MongoDB no inicializado" });
  }

  const {
    nombre,
    apellidos,
    email,
    password,
    celular,
    departamento,
    ciudad,
    direccion,
    tipoUsuario,
    createdAt,
  } = req.body || {};

  if (!nombre || !email || !password) {
    return res
      .status(400)
      .json({ message: "nombre, email y password son obligatorios" });
  }

  if (!["vendedor", "cliente"].includes(tipoUsuario)) {
    return res
      .status(400)
      .json({ message: "tipoUsuario debe ser vendedor o cliente" });
  }

  try {
    const doc = {
      nombre: String(nombre).trim(),
      apellidos: String(apellidos || "").trim(),
      email: String(email).trim().toLowerCase(),
      password: String(password).trim(),
      celular: String(celular || "").trim(),
      departamento: String(departamento || "").trim(),
      ciudad: String(ciudad || "").trim(),
      direccion: String(direccion || "").trim(),
      tipoUsuario,
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    };

    const result = await usersCollection.insertOne(doc);
    return res.status(201).json({ insertedId: result.insertedId.toString() });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/api/users/login", async (req, res) => {
  if (!usersCollection) {
    return res.status(503).json({ message: "MongoDB no inicializado" });
  }

  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "email y password son obligatorios" });
  }

  try {
    const user = await usersCollection.findOne({
      email: String(email).trim().toLowerCase(),
      password: String(password).trim(),
    });

    if (!user) {
      return res.status(401).json({ message: "Correo o contraseña incorrectos" });
    }

    const { password: _pwd, _id, ...safeUser } = user;
    return res.json({ user: safeUser });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.put("/api/users/password", async (req, res) => {
  if (!usersCollection) {
    return res.status(503).json({ message: "MongoDB no inicializado" });
  }

  const { email, currentPassword, newPassword } = req.body || {};

  if (!email || !currentPassword || !newPassword) {
    return res
      .status(400)
      .json({ message: "email, currentPassword y newPassword son obligatorios" });
  }

  try {
    const user = await usersCollection.findOne({
      email: String(email).trim().toLowerCase(),
      password: String(currentPassword).trim(),
    });

    if (!user) {
      return res.status(401).json({ message: "Contraseña actual incorrecta" });
    }

    await usersCollection.updateOne(
      { email: String(email).trim().toLowerCase() },
      { $set: { password: String(newPassword).trim() } }
    );

    return res.json({ updated: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

async function start() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const db = client.db(DB_NAME);
  usersCollection = db.collection(USERS_COLLECTION);

  app.listen(PORT, () => {
    console.log(`Local Mongo API en http://localhost:${PORT}`);
    console.log(`Mongo conectado: ${MONGO_URI}/${DB_NAME}.${USERS_COLLECTION}`);
  });
}

start().catch((error) => {
  console.error("No se pudo iniciar el servidor local:", error.message);
  process.exit(1);
});
