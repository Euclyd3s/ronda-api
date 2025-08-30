import express from "express";
import pkg from "pg";
const { Pool } = pkg;
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" })); // limite maior para fotos em base64

// Conexão com o Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // definido no painel do Render
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
    const { colaborador, dataHoraInicio, dataHoraFim, assinatura, setor, inconformidades } = req.body;

    // Inserir na tabela rondas, coluna 'inconformidades' deve ser JSONB
    const result = await pool.query(
      "INSERT INTO rondas (colaborador, inicio, fim, assinatura, setor, inconformidades) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id",
      [colaborador, dataHoraInicio, dataHoraFim, assinatura, setor, JSON.stringify(inconformidades)]
    );

    res.json({ sucesso: true, id: result.rows[0].id });
  } catch (err) {
    console.error("Erro ao salvar ronda:", err);
    res.status(500).json({ sucesso: false, erro: err.message });
  }
});

// Porta do Render (ou local)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API rodando na porta ${PORT}`));

