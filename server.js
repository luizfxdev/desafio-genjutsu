// ============================================
// SERVIDOR NODE.JS - BANCO DE DADOS PANGRAMAS
// ============================================
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Caminho para o arquivo de dados
const DATA_FILE = path.join(__dirname, 'pangramas.txt');

// Alfabeto português moderno (26 letras, sem ç)
const PORTUGUESE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

// ============================================
// FUNÇÕES DE LEITURA E PROCESSAMENTO
// ============================================

/**
 * Lê o arquivo pangramas.txt
 * @returns {Object} - Dados do arquivo JSON
 */
async function readPangramasFile() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Erro ao ler arquivo:', error);
    throw new Error('Não foi possível ler o arquivo de dados');
  }
}

/**
 * Remove acentos de uma string
 * @param {string} str - String com acentos
 * @returns {string} - String sem acentos
 */
function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normaliza a frase para análise
 * @param {string} phrase - Frase original
 * @returns {string} - Frase normalizada
 */
function normalizePhrase(phrase) {
  let normalized = removeAccents(phrase.toLowerCase());
  // Converte ç para c
  normalized = normalized.replace(/ç/g, 'c');
  // Remove tudo que não seja letra (a-z)
  normalized = normalized.replace(/[^a-z]/g, '');
  return normalized;
}

/**
 * Verifica se uma frase é pangrama
 * @param {string} phrase - Frase a verificar
 * @returns {Object} - Resultado da verificação
 */
function checkPangram(phrase) {
  const normalized = normalizePhrase(phrase);
  const uniqueLetters = new Set(normalized.split(''));

  // Verifica se tem todas as 26 letras
  const hasAllLetters = Array.from(PORTUGUESE_ALPHABET).every(letter => uniqueLetters.has(letter));

  if (!hasAllLetters) {
    return { type: 'not-pangram', isPangram: false, isPerfect: false };
  }

  // Verifica se é perfeito (26 letras únicas e 26 caracteres totais)
  const isPerfect =
    normalized.length === 26 &&
    uniqueLetters.size === 26 &&
    Array.from(PORTUGUESE_ALPHABET).every(letter => {
      const count = (normalized.match(new RegExp(letter, 'g')) || []).length;
      return count === 1;
    });

  return {
    type: isPerfect ? 'perfect' : 'pangram',
    isPangram: true,
    isPerfect: isPerfect
  };
}

/**
 * Calcula as estatísticas do banco de dados
 * @param {Array} phrases - Lista de frases
 * @returns {Object} - Estatísticas calculadas
 */
function calculateStats(phrases) {
  let perfectCount = 0;
  let pangramCount = 0;
  let notPangramCount = 0;

  phrases.forEach(phrase => {
    const result = checkPangram(phrase);
    if (result.isPerfect) {
      perfectCount++;
    } else if (result.isPangram) {
      pangramCount++;
    } else {
      notPangramCount++;
    }
  });

  return {
    pangramas_perfeitos_count: perfectCount,
    pangramas_count: pangramCount,
    nao_pangramas_count: notPangramCount,
    total_strings: phrases.length
  };
}

// ============================================
// ROTAS DA API
// ============================================

/**
 * GET /api/stats
 * Retorna as estatísticas calculadas dinamicamente
 */
app.get('/api/stats', async (req, res) => {
  try {
    const data = await readPangramasFile();
    const stats = calculateStats(data.lista_strings);
    res.json(stats);
  } catch (error) {
    console.error('Erro ao calcular estatísticas:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/pangramas
 * Retorna todas as frases do banco de dados
 */
app.get('/api/pangramas', async (req, res) => {
  try {
    const data = await readPangramasFile();
    res.json(data.lista_strings);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/pangramas/type/:type
 * Retorna frases de um tipo específico (perfect, pangram, not-pangram)
 */
app.get('/api/pangramas/type/:type', async (req, res) => {
  try {
    const data = await readPangramasFile();
    const { type } = req.params;

    const filtered = data.lista_strings.filter(phrase => {
      const result = checkPangram(phrase);
      return result.type === type;
    });

    res.json({
      type: type,
      count: filtered.length,
      phrases: filtered
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * POST /api/check
 * Verifica se uma frase é pangrama
 */
app.post('/api/check', async (req, res) => {
  try {
    const { phrase } = req.body;

    if (!phrase) {
      return res.status(400).json({ error: 'Frase não fornecida' });
    }

    const result = checkPangram(phrase);

    res.json({
      phrase: phrase,
      normalized: normalizePhrase(phrase),
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/random/:type?
 * Retorna uma frase aleatória (opcionalmente de um tipo específico)
 */
app.get('/api/random/:type?', async (req, res) => {
  try {
    const data = await readPangramasFile();
    const { type } = req.params;

    let phrases = data.lista_strings;

    if (type) {
      phrases = phrases.filter(phrase => {
        const result = checkPangram(phrase);
        return result.type === type;
      });
    }

    if (phrases.length === 0) {
      return res.status(404).json({ error: 'Nenhuma frase encontrada' });
    }

    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    const result = checkPangram(randomPhrase);

    res.json({
      phrase: randomPhrase,
      ...result
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/search
 * Busca frases que contenham um texto específico
 */
app.get('/api/search', async (req, res) => {
  try {
    const data = await readPangramasFile();
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Parâmetro de busca não fornecido' });
    }

    const searchTerm = q.toLowerCase();
    const results = data.lista_strings.filter(phrase => phrase.toLowerCase().includes(searchTerm));

    res.json({
      query: q,
      count: results.length,
      results: results
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /
 * Rota raiz - informações da API
 */
app.get('/', (req, res) => {
  res.json({
    name: 'Desafio do Genjutsu - API de Pangramas',
    version: '1.0.0',
    alphabet: PORTUGUESE_ALPHABET,
    alphabetLength: PORTUGUESE_ALPHABET.length,
    endpoints: {
      stats: 'GET /api/stats',
      allPhrases: 'GET /api/pangramas',
      byType: 'GET /api/pangramas/type/:type',
      check: 'POST /api/check',
      random: 'GET /api/random/:type?',
      search: 'GET /api/search?q=texto'
    }
  });
});

// ============================================
// INICIALIZAÇÃO DO SERVIDOR
// ============================================

app.listen(PORT, async () => {
  console.log(`\n🎭 Servidor do Desafio do Genjutsu rodando!`);
  console.log(`📡 Porta: ${PORT}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}`);
  console.log(`📊 API Stats: http://localhost:${PORT}/api/stats`);
  console.log(`📚 Alfabeto: ${PORTUGUESE_ALPHABET} (${PORTUGUESE_ALPHABET.length} letras)\n`);

  // Calcula e exibe estatísticas ao iniciar
  try {
    const data = await readPangramasFile();
    const stats = calculateStats(data.lista_strings);
    console.log('📈 Estatísticas do banco de dados:');
    console.log(`   - Pangramas Perfeitos: ${stats.pangramas_perfeitos_count}`);
    console.log(`   - Pangramas: ${stats.pangramas_count}`);
    console.log(`   - Não-Pangramas: ${stats.nao_pangramas_count}`);
    console.log(`   - Total de strings: ${stats.total_strings}\n`);
  } catch (error) {
    console.error('⚠️  Erro ao carregar estatísticas iniciais:', error.message);
  }
});

// Tratamento de erros não capturados
process.on('unhandledRejection', error => {
  console.error('Erro não tratado:', error);
});

process.on('uncaughtException', error => {
  console.error('Exceção não capturada:', error);
  process.exit(1);
});
