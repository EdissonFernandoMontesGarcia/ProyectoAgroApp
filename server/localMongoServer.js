require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const PORT = Number(process.env.LOCAL_API_PORT || 4000);
const MONGO_URI = process.env.LOCAL_MONGO_URI || "mongodb://127.0.0.1:27017";
const DB_NAME = process.env.LOCAL_MONGO_DB || "AgroApp";
const USERS_COLLECTION = process.env.LOCAL_MONGO_USERS_COLLECTION || "usuarios";

let usersCollection;
let productsCollection;
let ratingsCollection;

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

// Recuperar contraseña (reset sin verificación de contraseña actual)
app.post("/api/users/reset-password", async (req, res) => {
  if (!usersCollection) {
    return res.status(503).json({ message: "MongoDB no inicializado" });
  }
  const { email, newPassword } = req.body || {};
  if (!email || !newPassword) {
    return res.status(400).json({ message: "email y newPassword son obligatorios" });
  }
  try {
    const user = await usersCollection.findOne({
      email: String(email).trim().toLowerCase(),
    });
    if (!user) {
      return res.status(404).json({ message: "No existe una cuenta con ese correo" });
    }
    await usersCollection.updateOne(
      { email: String(email).trim().toLowerCase() },
      { $set: { password: String(newPassword).trim() } }
    );
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  if (!productsCollection) {
    return res.status(503).json({ message: "MongoDB no inicializado" });
  }

  const { nombre, descripcion, cantidad, estado, vendedor, createdAt } = req.body || {};

  if (!nombre) {
    return res.status(400).json({ message: "nombre es obligatorio" });
  }

  try {
    const doc = {
      nombre: String(nombre).trim(),
      descripcion: String(descripcion || "").trim(),
      cantidad: Number(cantidad) || 1,
      estado: estado || "Activo",
      vendedor: String(vendedor || "").trim().toLowerCase(),
      createdAt: createdAt ? new Date(createdAt) : new Date(),
    };

    const result = await productsCollection.insertOne(doc);
    return res.status(201).json({ insertedId: result.insertedId.toString() });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/api/products", async (req, res) => {
  if (!productsCollection) {
    return res.status(503).json({ message: "MongoDB no inicializado" });
  }

  const { vendedor } = req.query;

  try {
    const query = vendedor ? { vendedor: String(vendedor).trim().toLowerCase() } : {};
    const docs = await productsCollection.find(query).sort({ createdAt: -1 }).toArray();
    const result = docs.map((d) => ({ ...d, _id: d._id.toString() }));
    return res.json({ products: result });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.put("/api/products/:id", async (req, res) => {
  if (!productsCollection) {
    return res.status(503).json({ message: "MongoDB no inicializado" });
  }

  const { id } = req.params;
  const { nombre, descripcion, cantidad, estado } = req.body || {};

  try {
    const update = { updatedAt: new Date() };
    if (nombre !== undefined) update.nombre = String(nombre).trim();
    if (descripcion !== undefined) update.descripcion = String(descripcion).trim();
    if (cantidad !== undefined) update.cantidad = Number(cantidad);
    if (estado !== undefined) update.estado = estado;

    await productsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    );

    return res.json({ updated: true });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ── Wompi: firma de integridad ────────────────────────────────────────────────
app.post("/api/wompi/signature", (req, res) => {
  const secret = process.env.WOMPI_INTEGRITY_SECRET || "";
  if (!secret) {
    return res.status(500).json({ error: "WOMPI_INTEGRITY_SECRET no configurado en .env" });
  }

  const { reference, amountInCents, currency, expirationTime } = req.body || {};
  if (!reference || !amountInCents || !currency) {
    return res.status(400).json({ error: "Faltan campos: reference, amountInCents, currency" });
  }

  let str = `${reference}${amountInCents}${currency}`;
  if (expirationTime) str += expirationTime;
  str += secret;

  const signature = crypto.createHash("sha256").update(str).digest("hex");
  return res.json({ signature });
});

// ── Calificaciones ───────────────────────────────────────────────────────────
app.post("/api/ratings", async (req, res) => {
  if (!ratingsCollection) {
    return res.status(503).json({ message: "MongoDB no inicializado" });
  }

  const { facturaId, usuario, fechaCalificacion, calificaciones } = req.body || {};
  if (!calificaciones) {
    return res.status(400).json({ message: "Faltan calificaciones" });
  }

  try {
    const doc = {
      facturaId: String(facturaId || ""),
      usuario: String(usuario || "").trim().toLowerCase(),
      fechaCalificacion: fechaCalificacion ? new Date(fechaCalificacion) : new Date(),
      calificaciones: {
        experienciaGeneral: Number(calificaciones.experienciaGeneral || 0),
        calidadProducto: Number(calificaciones.calidadProducto || 0),
        relacionPrecioCalidad: Number(calificaciones.relacionPrecioCalidad || 0),
        tiempoRespuesta: Number(calificaciones.tiempoRespuesta || 0),
        mejorar: String(calificaciones.mejorar || "No"),
      },
      createdAt: new Date(),
    };

    const result = await ratingsCollection.insertOne(doc);
    return res.status(201).json({ ok: true, insertedId: result.insertedId.toString() });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

app.get("/api/ratings", async (req, res) => {
  if (!ratingsCollection) {
    return res.status(503).json({ message: "MongoDB no inicializado" });
  }
  const { usuario } = req.query;
  try {
    const query = usuario ? { usuario: String(usuario).trim().toLowerCase() } : {};
    const docs = await ratingsCollection.find(query).sort({ createdAt: -1 }).toArray();
    return res.json({ ratings: docs.map((d) => ({ ...d, _id: d._id.toString() })) });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

async function start() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const db = client.db(DB_NAME);
  usersCollection = db.collection(USERS_COLLECTION);
  productsCollection = db.collection("productos");
  ratingsCollection = db.collection("calificaciones");

  app.listen(PORT, () => {
    console.log(`Local Mongo API en http://localhost:${PORT}`);
    console.log(`Mongo conectado: ${MONGO_URI}/${DB_NAME}.${USERS_COLLECTION}`);
  });
}

start().catch((error) => {
  console.error("No se pudo iniciar el servidor local:", error.message);
  process.exit(1);
});
