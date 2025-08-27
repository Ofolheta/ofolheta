const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: 'postgres',     
  host: 'localhost',
  database: 'ofolheta',   
  password: 'master',        
  port: 5432,
});

app.post('/salvar-email', async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'E-mail inválido' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO leads (email, status) VALUES ($1, $2) RETURNING *',
      [email, 'PE'] 
    );
    
    res.json({ 
      success: true, 
      message: 'E-mail salvo com sucesso!',
      data: result.rows[0]
    });
    
  } catch (error) {
    if (error.code === '23505') {
      return res.status(400).json({ 
        error: 'Este e-mail já está cadastrado em nossa base!' 
      });
    }
    
    console.error('Erro no banco:', error);
    res.status(500).json({ error: 'Erro ao salvar e-mail' });
  }
});

app.get('/', (req, res) => {
  res.send('API do Ofolheta funcionando!');
});
 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});