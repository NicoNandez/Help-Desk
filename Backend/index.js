require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend funcionando OK");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log("Servidor activo en puerto", PORT);
});

const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get("/test-db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error conectando a la BD" });
  }
});
// Crear ticket
app.post("/tickets", async (req, res) => {
  const { titulo, descripcion } = req.body;

  if (!titulo || !descripcion) {
    return res.status(400).json({ error: "Datos incompletos" });
  }

  try {
    const result = await pool.query(
      "INSERT INTO tickets (titulo, descripcion) VALUES ($1, $2) RETURNING *",
      [titulo, descripcion]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creando ticket" });
  }
});

// Listar tickets
app.get("/tickets", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM tickets ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo tickets" });
  }
});
