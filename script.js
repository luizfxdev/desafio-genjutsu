// ============================================
// DESAFIO DO GENJUTSU - PANGRAMA DE ITACHI
// ============================================

// Elementos do DOM
const inputPhrase = document.getElementById('input-phrase');
const btnDecifrar = document.getElementById('btn-decifrar');
const btnRetornar = document.getElementById('btn-retornar');
const resultSection = document.getElementById('result-section');
const resultContent = document.getElementById('result-content');
const statsSection = document.getElementById('stats-section');
const playAudioBtn = document.getElementById('play-audio');
const pauseAudioBtn = document.getElementById('pause-audio');
const themeAudio = document.getElementById('theme-audio');

// Alfabeto português moderno (26 letras: A-Z, incluindo K, W e Y)
const PORTUGUESE_ALPHABET = 'abcdefghijklmnopqrstuvwxyz';

// Pangramas perfeitos conhecidos (26 letras únicas, 26 caracteres totais)
const PERFECT_PANGRAMS = [
  'bcdfghjklmnpqrstvwxyzaeiou',
  'zyxwvutsrqponmlkjihgfedcba',
  'qwertyuiopasdfghjklzxcvbnm',
  'abcdefghijklmnopqrstuvwxyz',
  'pkwyzfjordquetchsgavnimbl' // Corrigido: sem espaços para ter exatamente 26 caracteres
];

// ============================================
// FUNÇÕES DE VALIDAÇÃO DE PANGRAMA
// ============================================

/**
 * Remove acentos de uma string
 * @param {string} str - String com acentos
 * @returns {string} - String sem acentos
 */
function removeAccents(str) {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

/**
 * Normaliza a frase para análise (remove espaços, pontuação e converte para minúsculas)
 * @param {string} phrase - Frase a ser normalizada
 * @returns {string} - Frase normalizada
 */
function normalizePhrase(phrase) {
  // Remove acentos e converte para minúsculas
  let normalized = removeAccents(phrase.toLowerCase());

  // Converte ç para c
  normalized = normalized.replace(/ç/g, 'c');

  // Remove tudo que não seja letra (a-z)
  normalized = normalized.replace(/[^a-z]/g, '');

  return normalized;
}

/**
 * Obtém as letras únicas presentes na frase
 * @param {string} normalizedPhrase - Frase normalizada
 * @returns {Set} - Conjunto de letras únicas
 */
function getUniqueLetters(normalizedPhrase) {
  return new Set(normalizedPhrase.split(''));
}

/**
 * Conta a frequência de cada letra na frase
 * @param {string} normalizedPhrase - Frase normalizada
 * @returns {Object} - Objeto com frequência de cada letra
 */
function countLetterFrequency(normalizedPhrase) {
  const frequency = {};

  for (let letter of normalizedPhrase) {
    frequency[letter] = (frequency[letter] || 0) + 1;
  }

  return frequency;
}

/**
 * Verifica se a frase é um pangrama (tem todas as 26 letras)
 * @param {Set} uniqueLetters - Conjunto de letras únicas
 * @returns {boolean} - true se for pangrama
 */
function isPangram(uniqueLetters) {
  // Deve ter exatamente 26 letras únicas
  if (uniqueLetters.size !== PORTUGUESE_ALPHABET.length) {
    return false;
  }

  // Verifica se tem todas as letras do alfabeto
  for (let letter of PORTUGUESE_ALPHABET) {
    if (!uniqueLetters.has(letter)) {
      return false;
    }
  }

  return true;
}

/**
 * Verifica se a frase é um pangrama perfeito
 * (cada uma das 26 letras aparece exatamente UMA vez)
 * @param {string} normalizedPhrase - Frase normalizada
 * @param {Object} frequency - Frequência das letras
 * @param {Set} uniqueLetters - Conjunto de letras únicas
 * @returns {boolean} - true se for pangrama perfeito
 */
function isPerfectPangram(normalizedPhrase, frequency, uniqueLetters) {
  // Deve ter exatamente 26 caracteres (total)
  if (normalizedPhrase.length !== PORTUGUESE_ALPHABET.length) {
    return false;
  }

  // Deve ter exatamente 26 letras únicas
  if (uniqueLetters.size !== PORTUGUESE_ALPHABET.length) {
    return false;
  }

  // Cada letra deve aparecer exatamente uma vez
  for (let letter of PORTUGUESE_ALPHABET) {
    if (!frequency[letter] || frequency[letter] !== 1) {
      return false;
    }
  }

  return true;
}

/**
 * Obtém as letras faltantes para ser pangrama
 * @param {Set} uniqueLetters - Conjunto de letras únicas
 * @returns {Array} - Array com letras faltantes
 */
function getMissingLetters(uniqueLetters) {
  const missing = [];

  for (let letter of PORTUGUESE_ALPHABET) {
    if (!uniqueLetters.has(letter)) {
      missing.push(letter);
    }
  }

  return missing;
}

// ============================================
// FUNÇÕES DE INTERFACE E EXIBIÇÃO
// ============================================

/**
 * Analisa a frase e retorna o resultado detalhado
 * @param {string} phrase - Frase original
 * @returns {Object} - Objeto com análise completa
 */
function analyzePhrase(phrase) {
  const normalized = normalizePhrase(phrase);
  const uniqueLetters = getUniqueLetters(normalized);
  const frequency = countLetterFrequency(normalized);
  const missingLetters = getMissingLetters(uniqueLetters);

  // Verifica primeiro se é pangrama perfeito (26 letras, cada uma aparece 1 vez)
  const isPerfect = isPerfectPangram(normalized, frequency, uniqueLetters);

  // Se não for perfeito, verifica se é pangrama regular
  const isRegularPangram = isPerfect ? false : isPangram(uniqueLetters);

  return {
    original: phrase,
    normalized,
    normalizedLength: normalized.length,
    uniqueLetters,
    uniqueCount: uniqueLetters.size,
    frequency,
    isPerfect,
    isPangram: isRegularPangram,
    missingLetters,
    type: isPerfect ? 'perfect' : isRegularPangram ? 'pangram' : 'not-pangram'
  };
}

/**
 * Gera o HTML com o resultado da análise
 * @param {Object} analysis - Objeto com análise da frase
 * @returns {string} - HTML formatado
 */
function generateResultHTML(analysis) {
  let html = '';

  // Passo 1: Frase original
  html += `
        <div class="calculation-step">
            <strong>📝 Passo 1: Frase Original</strong>
            <p>${analysis.original}</p>
        </div>
    `;

  // Passo 2: Normalização
  html += `
        <div class="calculation-step">
            <strong>🔄 Passo 2: Normalização</strong>
            <p>Removendo espaços, pontuação, acentos (incluindo ç→c) e convertendo para minúsculas:</p>
            <code>${analysis.normalized}</code>
            <p style="margin-top: 8px; font-size: 12px; color: rgba(0, 0, 0, 0.6);">
                Total de caracteres: ${analysis.normalizedLength} | 
                Letras únicas: ${analysis.uniqueCount}/26
            </p>
        </div>
    `;

  // Passo 3: Letras únicas
  const uniqueArray = Array.from(analysis.uniqueLetters).sort();
  html += `
        <div class="calculation-step">
            <strong>🔤 Passo 3: Letras Únicas Encontradas</strong>
            <p>Total: ${analysis.uniqueCount} de ${PORTUGUESE_ALPHABET.length} letras do alfabeto (a-z)</p>
            <code>${uniqueArray.join(', ')}</code>
        </div>
    `;

  // Passo 4: Análise detalhada
  if (analysis.isPerfect || analysis.isPangram) {
    const freqArray = PORTUGUESE_ALPHABET.split('').map(l => {
      const count = analysis.frequency[l] || 0;
      return `${l}: ${count}`;
    });

    html += `
            <div class="calculation-step">
                <strong>📊 Passo 4: Frequência de Cada Letra</strong>
                <code style="font-size: 11px;">${freqArray.join(' | ')}</code>
            </div>
        `;

    // Se for pangrama perfeito, destacar isso
    if (analysis.isPerfect) {
      html += `
                <div class="calculation-step">
                    <strong>✨ Análise: PANGRAMA PERFEITO!</strong>
                    <p>🏆 Todas as 26 letras aparecem exatamente UMA vez!</p>
                    <p>🎯 Total de caracteres: ${analysis.normalizedLength} (perfeito!)</p>
                    <p style="margin-top: 8px; font-size: 12px; color: rgba(0, 0, 0, 0.6);">
                        Nenhuma letra se repete. Você encontrou o pangrama mais raro de todos!
                    </p>
                </div>
            `;
    } else {
      // É pangrama regular
      const repeatedLetters = PORTUGUESE_ALPHABET.split('').filter(l => analysis.frequency[l] > 1);
      const totalRepetitions = repeatedLetters.reduce((sum, l) => sum + (analysis.frequency[l] - 1), 0);

      html += `
                <div class="calculation-step">
                    <strong>✅ Análise: PANGRAMA</strong>
                    <p>Todas as 26 letras estão presentes, mas ${
                      repeatedLetters.length
                    } letra(s) se repetem (${totalRepetitions} repetição/ões no total):</p>
                    <code>${repeatedLetters.map(l => `${l} (${analysis.frequency[l]}x)`).join(', ')}</code>
                </div>
            `;
    }
  } else {
    // Não é pangrama - mostrar letras faltantes
    html += `
            <div class="calculation-step">
                <strong>❌ Passo 4: Letras Faltantes</strong>
                <p>Para ser um pangrama, faltam ${analysis.missingLetters.length} letra(s):</p>
                <code>${analysis.missingLetters.join(', ')}</code>
            </div>
        `;
  }

  // Resultado final com mensagens de Itachi
  let finalMessage = '';
  let resultClass = '';

  if (analysis.isPerfect) {
    resultClass = 'perfect-pangram';
    finalMessage = `
            <h4>🏆 PANGRAMA PERFEITO!</h4>
            <p>"Ser o melhor não é tudo a se fazer. Quando você é forte, você se torna arrogante e afastado. Mesmo se o que você procurou foi o seu sonho."</p>
            <p style="margin-top: 12px; font-weight: bold;">Você alcançou a perfeição absoluta! Saiu do Tsukuyomi instantaneamente. Itachi reconhece sua maestria!</p>
            <p style="margin-top: 8px; font-size: 13px; font-style: italic;">Você encontrou um dos raros pangramas perfeitos - 26 letras, cada uma aparecendo exatamente 1 vez.</p>
        `;
  } else if (analysis.isPangram) {
    resultClass = '';
    finalMessage = `
            <h4>✅ PANGRAMA!</h4>
            <p>"Você se concentra no trivial e perde de vista o que mais importa. A mudança é impossível neste pântano de ignorância."</p>
            <p style="margin-top: 12px; font-weight: bold;">Você é fraco... Conseguiu se libertar do genjutsu com dificuldade. Precisa melhorar muito!</p>
        `;
  } else {
    resultClass = '';
    finalMessage = `
            <h4>❌ NÃO É PANGRAMA</h4>
            <p>"Aqueles que não são capazes de se reconhecer estão fadados ao fracasso. Se você quer me matar... Me odeie, me amaldiçoe, e fuja, fuja..."</p>
            <p style="margin-top: 12px; font-weight: bold;">Viva uma vida miserável correndo e se escondendo. Você falhou mais uma vez e ficará preso ao genjutsu enquanto pensar assim.</p>
        `;
  }

  html += `
        <div class="final-result ${resultClass}">
            ${finalMessage}
        </div>
    `;

  return html;
}

/**
 * Carrega as estatísticas do banco de dados
 */
async function loadStats() {
  try {
    const response = await fetch('http://localhost:3000/api/stats');

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    document.getElementById('stat-perfect').textContent = data.pangramas_perfeitos_count;
    document.getElementById('stat-pangrams').textContent = data.pangramas_count;
    document.getElementById('stat-non-pangrams').textContent = data.nao_pangramas_count;
    document.getElementById('stat-total').textContent = data.total_strings;

    statsSection.classList.add('show');

    console.log('📊 Estatísticas carregadas:', data);
  } catch (error) {
    console.error('⚠️  Erro ao carregar estatísticas:', error.message);
    console.warn('💡 Verifique se o servidor está rodando: node server.js');
    // Não mostra a seção de estatísticas se o servidor não estiver disponível
    statsSection.classList.remove('show');
  }
}

// ============================================
// EVENT LISTENERS
// ============================================

/**
 * Evento do botão DECIFRAR
 */
btnDecifrar.addEventListener('click', () => {
  const phrase = inputPhrase.value.trim();

  if (!phrase) {
    alert('Por favor, digite uma frase ou palavra!');
    return;
  }

  // Analisa a frase
  const analysis = analyzePhrase(phrase);

  // Log para debug
  console.log('🔍 Análise:', analysis);

  // Gera e exibe o resultado
  resultContent.innerHTML = generateResultHTML(analysis);
  resultSection.classList.add('show');

  // Scroll suave até o resultado
  setTimeout(() => {
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 100);
});

/**
 * Evento do botão RETORNAR
 */
btnRetornar.addEventListener('click', () => {
  // Limpa o input
  inputPhrase.value = '';

  // Esconde o resultado
  resultSection.classList.remove('show');
  resultContent.innerHTML = '';

  // Foca no input
  inputPhrase.focus();
});

/**
 * Permite pressionar Enter no input para decifrar
 */
inputPhrase.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    btnDecifrar.click();
  }
});

// ============================================
// CONTROLES DE ÁUDIO
// ============================================

/**
 * Botão para tocar o áudio
 */
playAudioBtn.addEventListener('click', () => {
  themeAudio
    .play()
    .then(() => {
      console.log('🎵 Áudio iniciado');
    })
    .catch(error => {
      console.error('❌ Erro ao tocar áudio:', error);
    });
});

/**
 * Botão para pausar o áudio
 */
pauseAudioBtn.addEventListener('click', () => {
  themeAudio.pause();
  console.log('⏸️  Áudio pausado');
});

// ============================================
// INICIALIZAÇÃO
// ============================================

/**
 * Função executada quando a página carrega
 */
document.addEventListener('DOMContentLoaded', () => {
  console.log('🎭 Desafio do Genjutsu iniciado!');
  console.log(`📚 Alfabeto considerado: ${PORTUGUESE_ALPHABET} (26 letras)`);
  console.log('📋 Critérios:');
  console.log('   - PANGRAMA PERFEITO: 26 letras únicas, 26 caracteres totais (cada letra aparece exatamente 1 vez)');
  console.log('   - PANGRAMA: Todas as 26 letras aparecem pelo menos 1 vez (com repetições permitidas)');
  console.log('   - NÃO-PANGRAMA: Faltam uma ou mais letras');
  console.log('\n🏆 Pangramas Perfeitos conhecidos:');
  PERFECT_PANGRAMS.forEach((p, i) => console.log(`   ${i + 1}. "${p}"`));

  // Carrega as estatísticas do banco de dados
  loadStats();

  // Foca no input ao carregar
  inputPhrase.focus();
});

// ============================================
// FUNÇÕES AUXILIARES PARA TESTES
// ============================================

/**
 * Função para testar os pangramas perfeitos
 */
function testPerfectPangrams() {
  console.group('🧪 Testando Pangramas Perfeitos');

  PERFECT_PANGRAMS.forEach((phrase, index) => {
    const analysis = analyzePhrase(phrase);
    console.log(`\n${index + 1}. "${phrase}"`);
    console.log(`   Tipo: ${analysis.type}`);
    console.log(`   Caracteres totais: ${analysis.normalizedLength}`);
    console.log(`   Letras únicas: ${analysis.uniqueCount}/26`);
    console.log(`   É Pangrama Perfeito: ${analysis.isPerfect ? '✅ SIM' : '❌ NÃO'}`);
    console.log(`   É Pangrama: ${analysis.isPangram ? '✅ SIM' : '❌ NÃO'}`);

    if (!analysis.isPerfect) {
      console.warn('   ⚠️ ATENÇÃO: Esta frase NÃO é um pangrama perfeito!');
      if (analysis.uniqueCount < 26) {
        console.log(`   Faltam: ${analysis.missingLetters.join(', ')}`);
      } else if (analysis.normalizedLength > 26) {
        const repeated = Object.keys(analysis.frequency).filter(l => analysis.frequency[l] > 1);
        console.log(`   Letras repetidas: ${repeated.map(l => `${l} (${analysis.frequency[l]}x)`).join(', ')}`);
      }
    } else {
      console.log('   🎊 Confirmado: É um PANGRAMA PERFEITO!');
    }
  });

  console.groupEnd();
}

/**
 * Função para testar múltiplas frases (uso em console)
 * @param {Array} phrases - Array de frases para testar
 */
function testPhrases(phrases) {
  console.group('🧪 Testando Frases');

  phrases.forEach((phrase, index) => {
    const analysis = analyzePhrase(phrase);
    console.log(`\n${index + 1}. "${phrase}"`);
    console.log(`   Tipo: ${analysis.type}`);
    console.log(`   Letras únicas: ${analysis.uniqueCount}/${PORTUGUESE_ALPHABET.length}`);

    if (analysis.type === 'not-pangram') {
      console.log(`   Faltam: ${analysis.missingLetters.join(', ')}`);
    }
  });

  console.groupEnd();
}

// Disponibiliza funções globalmente para testes no console
window.testPerfectPangrams = testPerfectPangrams;
window.testPhrases = testPhrases;
window.analyzePhrase = analyzePhrase;

// Testa automaticamente os pangramas perfeitos ao carregar
console.log('\n🔍 Executando teste automático dos pangramas perfeitos...\n');
testPerfectPangrams();
