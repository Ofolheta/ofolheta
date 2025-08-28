const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Supabase - URL e Key DIRETO
const supabaseUrl = 'https://jnqbmsgslhpiyfbvijcz.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpucWJtc2dzbGhwaXlmYnZpamN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYzMzc3MTksImV4cCI6MjA3MTkxMzcxOX0.vqWImKUfJKWhiMxab_Q2Xp_D5CauECP5bTPcJIhrQjQ';

console.log('🔌 Iniciando Supabase com URL:', supabaseUrl);
const supabase = createClient(supabaseUrl, supabaseKey);

// Rota simples de teste
app.get('/', (req, res) => {
  res.send('✅ API Ofolheta ONLINE com Supabase');
});

// Rota de saúde MELHORADA
app.get('/health', async (req, res) => {
  try {
    console.log('🩺 Testando conexão com Supabase...');
    const { data, error } = await supabase.from('leads').select('count');
    
    if (error) {
      console.error('❌ Erro no Supabase:', error);
      return res.status(500).json({ 
        status: 'ERROR', 
        error: error.message,
        details: error 
      });
    }
    
    console.log('✅ Supabase conectado com sucesso!');
    res.json({ 
      status: 'OK', 
      database: 'Supabase connected',
      supabaseUrl: supabaseUrl
    });
    
  } catch (error) {
    console.error('💥 Erro inesperado:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      error: error.message 
    });
  }
});

// Rota para salvar email - SIMPLIFICADA
app.post('/salvar-email', async (req, res) => {
  try {
    const { email } = req.body;
    console.log('📧 Recebendo email:', email);

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'E-mail inválido' });
    }

    console.log('💾 Tentando salvar no Supabase...');
    const { data, error } = await supabase
      .from('leads')
      .insert([{ 
        email: email, 
        status: 'PE',
        created_at: new Date().toISOString()
      }])
      .select();

    if (error) {
      console.error('❌ Erro ao salvar:', error);
      
      if (error.code === '23505') {
        return res.status(400).json({ error: 'E-mail já cadastrado!' });
      }
      
      return res.status(500).json({ 
        error: 'Erro ao salvar e-mail',
        details: error.message 
      });
    }

    console.log('✅ Email salvo com sucesso:', data[0]);
    res.json({ 
      success: true, 
      message: 'E-mail salvo com sucesso!',
      data: data[0]
    });
    
  } catch (error) {
    console.error('💥 Erro inesperado:', error);
    res.status(500).json({ 
      error: 'Erro interno do servidor',
      details: error.message 
    });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log('🚀 Servidor rodando na porta', PORT);
  console.log('📦 Supabase URL:', supabaseUrl);
  console.log('🔗 Health check: http://localhost:' + PORT + '/health');
});

app.get('/test-insert', async (req, res) => {
  try {
    console.log('Testando inserção...');
    const { data, error } = await supabase
      .from('leads')
      .insert([{ email: 'teste_direct@email.com', status: 'TEST' }])
      .select();
    
    if (error) {
      console.error('Erro na inserção:', error);
      return res.status(500).json({ error: error.message });
    }
    
    res.json({ success: true, data: data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
