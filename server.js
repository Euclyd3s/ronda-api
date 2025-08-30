import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// Conexão com o Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render pega do painel de env vars
  ssl: { rejectUnauthorized: false }
});

// Endpoint de status
app.get("/api/status", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ conectado: true });
  } catch (err) {
    res.json({ conectado: false, erro: err.message });
  }
});

// Endpoint para salvar ronda
app.post("/api/salvarRonda", async (req, res) => {
  try {
    const { colaborador, dataHoraInicio, dataHoraFim, assinatura } = req.body;
    await pool.query(
      "INSERT INTO rondas (colaborador, inicio, fim, assinatura) VALUES ($1, $2, $3, $4)",
      [colaborador, dataHoraInicio, dataHoraFim, assinatura]
    );
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ sucesso: false, erro: err.message });
  }
});

// Porta do Render (pega da env PORT)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));

