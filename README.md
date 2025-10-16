# 🎭 Desafio do Genjutsu: Encontre o Pangrama!

![Version](https://img.shields.io/badge/version-1.0.0-red.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)
![Naruto](https://img.shields.io/badge/inspired%20by-Naruto-orange.svg)
![Itachi](https://img.shields.io/badge/technique-Tsukuyomi-darkred.svg)

Projeto interativo baseado no universo de Naruto, onde você precisa escapar do Tsukuyomi de Itachi Uchiha identificando pangramas em frases.

---

## 📋 Descrição

Você está preso em um genjutsu lançado por Itachi Uchiha. Para se libertar, precisa analisar frases e identificar se são:

- **Pangrama Perfeito** 🎊: Contém todas as **26 letras do alfabeto latino moderno** (a–z) exatamente uma vez
- **Pangrama** ✅: Contém todas as 26 letras do alfabeto ao menos uma vez
- **Não-Pangrama** ❌: Não contém todas as 26 letras

### ⚠️ Observação Importante

O projeto foi **adaptado para usar o alfabeto latino moderno com 26 letras** (a–z). O **ç** é convertido para **c** durante a normalização para manter compatibilidade com entradas em português.

---

## 🚀 Estrutura do Projeto

```
desafio-genjutsu/
│
├── assets/
│   ├── background.mp4      # Vídeo de fundo (3840x2160 recomendado)
│   └── theme.mp3           # Música tema
│
├── index.html              # Página principal
├── styles.scss             # Estilos em SCSS
├── styles.css              # Estilos compilados (gerado automaticamente)
├── script.js               # Lógica do frontend (atualizado)
├── server.js               # Servidor Node.js (atualizado)
├── pangramas.txt           # Banco de dados JSON (lista de frases)
├── package.json            # Configuração do projeto
└── README.md               # Este arquivo
```

---

## ✅ Principais Mudanças Realizadas

### 🔄 Unificação do Alfabeto

- **Alfabeto oficial**: `abcdefghijklmnopqrstuvwxyz` (26 letras)
- **Normalização**: Remove acentos, converte `ç → c`, remove caracteres não alfabéticos
- **Compatibilidade**: Funciona com textos em português, convertendo automaticamente

### 📝 script.js

- ✅ Distingue claramente três tipos: `perfect`, `pangram` e `not-pangram`
- ✅ Inclui lista de **pangramas perfeitos de referência** (strings de 26 caracteres únicos)
- ✅ Lógica de destaque visual com classe `.perfect-pangram` (gradiente dourado)
- ✅ Melhorias em logs e mensagens de erro
- ✅ Validação robusta com feedback detalhado passo a passo

### 🖥️ server.js

- ✅ **Estatísticas calculadas dinamicamente** a partir de `pangramas.txt`
- ✅ Função `calculateStats()` para análise em tempo real
- ✅ `checkPangram()` e `normalizePhrase()` atualizados para 26 letras
- ✅ Conversão automática de `ç → c`
- ✅ Tratamento robusto de erros de leitura/parsing do arquivo JSON
- ✅ API REST completa com 6 endpoints

### 🎨 styles.scss

- ✅ Paleta inspirada em pergaminho ninja e Sharingan
- ✅ Cores: texto preto, títulos em vermelho-sangue, acentos verde Uchiha
- ✅ **Destaque dourado animado** para pangrama perfeito
- ✅ Design responsivo e moderno
- ✅ Efeitos glassmorphism e scrollbar personalizada

### 🐛 Correções

- ✅ Corrigido erro no `pangramas.txt` (vírgula faltando)
- ✅ Resolvido `JSON.parse failure` no servidor
- ✅ Sincronização entre frontend e backend

---

## 🧩 Pangramas Perfeitos de Referência

As **5 strings de referência** usadas para validação (cada uma contém 26 letras únicas sem repetição):

```
bcdfghjklmnpqrstvwxyzaeiou
zyxwvutsrqponmlkjihgfedcba
qwertyuiopasdfghjklzxcvbnm
abcdefghijklmnopqrstuvwxyz
phqgiumeaylnofdxjkrcvstzwb
```

> **Nota**: Pangramas perfeitos que façam sentido semântico são extremamente raros. As referências acima são sequências artificiais para teste e validação técnica.

---

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <repo-url>
cd desafio-genjutsu
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Prepare os arquivos de mídia

Coloque seus arquivos na pasta `assets/`:
- `background.mp4` (3840x2160 recomendado)
- `theme.mp3` (opcional, mas recomendado)

### 4. Compile o SCSS

```bash
# Compila uma vez
npm run sass

# Observa alterações (modo watch)
npm run sass:watch

# Versão minificada (produção)
npm run build:css
```

---

## ▶️ Como Executar

### 🔹 Método 1: Frontend Somente (sem backend)

Abra o arquivo `index.html` diretamente no navegador.

> ⚠️ **Limitação**: Recursos backend (estatísticas, API) não estarão disponíveis.

### 🔹 Método 2: Com Servidor Node.js (Recomendado)

1. Inicie o servidor:
```bash
npm start
```

2. Acesse no navegador:
```
http://localhost:3000
```

### 🔹 Método 3: Desenvolvimento Completo

Execute servidor e compilador SCSS simultaneamente:

```bash
npm run dev:all
```

---

## 📡 API Endpoints

O servidor Node.js oferece os seguintes endpoints:

### `GET /api/stats`
Retorna estatísticas calculadas dinamicamente

**Resposta:**
```json
{
  "pangramas_perfeitos_count": 5,
  "pangramas_count": 95,
  "nao_pangramas_count": 700,
  "total_strings": 800
}
```

### `GET /api/pangramas`
Retorna todas as frases do banco de dados

### `GET /api/pangramas/type/:type`
Retorna frases de um tipo específico

**Tipos válidos**: `perfect`, `pangram`, `not-pangram`

**Exemplo:**
```
GET /api/pangramas/type/perfect
```

### `POST /api/check`
Verifica se uma frase é pangrama

**Body:**
```json
{
  "phrase": "Jovem craque belga prediz falhas no xote com whisky."
}
```

**Resposta:**
```json
{
  "phrase": "Jovem craque...",
  "normalized": "jovemcraquebelga...",
  "type": "pangram",
  "isPangram": true,
  "isPerfect": false
}
```

### `GET /api/random/:type?`
Retorna uma frase aleatória

**Parâmetros opcionais**: `type` (perfect, pangram, not-pangram)

**Exemplo:**
```
GET /api/random/perfect
```

### `GET /api/search?q=texto`
Busca frases que contenham o texto especificado

**Exemplo:**
```
GET /api/search?q=whisky
```

---

## 🛠️ Como o Servidor Calcula Estatísticas

Ao acessar `/api/stats`, o servidor:

1. 📖 Lê o arquivo `pangramas.txt` (JSON com `lista_strings`)
2. 🔄 Normaliza cada frase (remove acento, `ç→c`, remove não-letras)
3. 🔍 Classifica:
   - **Perfect**: 26 caracteres normalizados únicos, cada letra aparece uma vez
   - **Pangram**: Todas as 26 letras presentes (com ou sem repetições)
   - **Not-pangram**: Faltam letras do alfabeto
4. 📊 Retorna contagens e total

---

## 🎮 Como Usar

1. **Digite uma frase** no campo de entrada
2. **Clique em DECIFRAR** para analisar
3. **Veja o resultado detalhado** com:
   - ✅ Passo a passo da validação
   - ✅ Letras encontradas
   - ✅ Frequência de cada letra
   - ✅ Letras faltantes (se aplicável)
   - ✅ Mensagem de Itachi baseada no resultado
4. **Clique em RETORNAR** para tentar outra frase
5. **Use os controles de áudio** (🎵 e ⏸️) para controlar a música tema

---

## 🎨 Funcionalidades

- ✅ Análise completa de pangramas (26 letras do alfabeto latino)
- ✅ Validação detalhada passo a passo
- ✅ Interface responsiva e moderna
- ✅ Vídeo de fundo em alta definição (suporta até 4K)
- ✅ Música tema com controles intuitivos
- ✅ Estatísticas do banco de dados em tempo real
- ✅ API REST completa com 6 endpoints
- ✅ Design temático de Naruto/Itachi Uchiha
- ✅ Animações suaves nos botões (mask animation)
- ✅ Scrollbar personalizada
- ✅ **Destaque dourado para pangramas perfeitos**
- ✅ Acessibilidade básica (ARIA, contraste, navegação por teclado)
- ✅ Conversão automática de caracteres portugueses

---

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Uso |
|------------|-----|
| ![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white) | Estrutura da página |
| ![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white) | Estilos e animações |
| ![Sass](https://img.shields.io/badge/Sass-CC6699?style=flat&logo=sass&logoColor=white) | Pré-processador CSS |
| ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black) | Lógica do frontend |
| ![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=node.js&logoColor=white) | Backend e servidor |
| ![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white) | Framework web |
| ![NPM](https://img.shields.io/badge/NPM-CB3837?style=flat&logo=npm&logoColor=white) | Gerenciamento de pacotes |

---

## 📱 Responsividade

O layout se adapta automaticamente para:

| Dispositivo | Resolução | Comportamento |
|------------|-----------|---------------|
| 🖥️ Desktop | 1920px+ | Container fixo à esquerda |
| 💻 Laptop | 1024px - 1920px | Container ajustado |
| 📱 Tablet | 768px - 1024px | Container centralizado |
| 📱 Mobile | 320px - 768px | Stack vertical, largura completa |

---

## 🎯 Regras do Desafio

### Alfabeto Oficial
```
a b c d e f g h i j k l m n o p q r s t u v w x y z
(26 letras)
```

### Normalização Automática
- ✅ Não diferencia maiúsculas de minúsculas
- ✅ Espaços, pontuação e acentuação são ignorados
- ✅ Acentos são removidos: `á → a`, `é → e`, `ü → u`
- ✅ **Conversão especial**: `ç → c`

### Resultados Possíveis

#### 1. 🎊 Pangrama Perfeito
- Todas as 27 letras aparecem **exatamente uma vez**
- **Mensagem**: "Ser o melhor não é tudo a se fazer. Quando você é forte, você se torna arrogante e afastado. Mesmo se o que você procurou foi o seu sonho. Sua habilidade contra genjutsu é formidável, você saiu facilmente. **Parabéns!**"

#### 2. ✅ Pangrama
- Todas as 26 letras aparecem **ao menos uma vez**
- **Mensagem**: "Você se concentra no trivial e perde de vista o que mais importa. A mudança é impossível neste pântano de ignorância. Você é fraco... Conseguiu se libertar do genjutsu com dificuldade e precisa melhorar muito!"

#### 3. ❌ Não-Pangrama
- **Faltam letras** do alfabeto
- **Mensagem**: "Aqueles que não são capazes de se reconhecer estão fadados ao fracasso. Se você quer me matar… Me odeie, me amaldiçoe, e fuja, fuja… Viva uma vida miserável correndo e se escondendo. Você falhou mais uma vez e ficará preso ao genjutsu enquanto pensar assim."

---

## 🧪 Testes e Ferramentas de Depuração

### No Console do Navegador

```javascript
// Testar uma frase específica
analyzePhrase("Jovem craque belga prediz falhas no xote com whisky.");

// Testar múltiplas frases de uma vez
testPhrases([
    "bcdfghjklmnpqrstvwxyzaeiou",
    "Zebras caolhas de Java querem mandar fax.",
    "O sol brilhou forte hoje."
]);

// Testar pangramas perfeitos
testPerfectPangrams();
```

### Via API

```bash
# Testar uma frase via POST
curl -X POST http://localhost:3000/api/check \
  -H "Content-Type: application/json" \
  -d '{"phrase":"abcdefghijklmnopqrstuvwxyz"}'

# Listar pangramas perfeitos
curl http://localhost:3000/api/pangramas/type/perfect

# Obter frase aleatória
curl http://localhost:3000/api/random/pangram
```

---

## ⚠️ Problemas Encontrados e Soluções

### 🐛 Problema 1: JSON Inválido em `pangramas.txt`

**Sintoma**: Servidor iniciava, mas ao calcular estatísticas lançava erro `JSON.parse`

**Causa**: Vírgula faltando entre elementos da array `lista_strings`

**Solução**: 
```json
// ❌ ERRADO
"frase1"
"frase2"

// ✅ CORRETO
"frase1",
"frase2"
```

### 🐛 Problema 2: Diferenças no Alfabeto

**Sintoma**: Inconsistência entre frontend e backend na consideração do `ç`

**Decisão**: Padronizar para **26 letras (a-z)** e converter `ç → c` durante normalização

**Documentação**: Explicitamente documentado neste README

### 🐛 Problema 3: Pangramas Perfeitos Semânticos

**Desafio**: Criar frases naturais com exatamente 26 letras únicas é muito difícil

**Escolha**: Usar sequências artificiais para validação técnica (documentadas na seção de referência)

### 🐛 Problema 4: Destaque Visual

**Solução**: Implementado no SCSS com gradiente dourado e animação

**Classe**: `.perfect-pangram` com efeito `box-shadow` animado

### 🐛 Problema 5: Prioridade de Feedback UX

**Ajuste**: Resultado do input tem mais relevância visual (card principal)

**Melhoria**: Estatísticas do banco aparecem de forma secundária mas carregadas via `/api/stats`

---

## 🧭 Boas Práticas para Manutenção

### ✅ Validação de Dados

- Sempre valide `pangramas.txt` com um **JSON linter** antes de reiniciar o servidor
- Use ferramentas online como [JSONLint](https://jsonlint.com/)

### ✅ Adição de Pangramas Perfeitos

- Garanta que a string normalizada tenha **26 caracteres**
- Verifique que tenha **26 letras únicas**
- Teste com `POST /api/check` antes de adicionar ao banco

### ✅ Testes Antes de Deploy

```bash
# 1. Teste o servidor
npm start

# 2. Verifique endpoints
curl http://localhost:3000/api/stats

# 3. Valide compilação SCSS
npm run build:css
```

### ✅ Monitoramento

- Verifique logs do servidor para erros
- Use `console.log` estratégico no frontend
- Monitore performance com DevTools

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

- 🐛 Reportar bugs via [Issues](../../issues)
- ✨ Sugerir novos recursos
- 🔀 Enviar Pull Requests
- 📝 Melhorar a documentação
- 🎨 Aprimorar o design

### Sugestões de Melhorias

1. **Gerador de Pangramas**: Algoritmos para criar pangramas sintéticos
2. **Editor Web**: Interface para gerenciar `pangramas.txt` com validação embutida
3. **Suporte Multilíngue**: Regras por idioma (inglês, espanhol, etc.)
4. **Modo Competitivo**: Timer e pontuação
5. **Compartilhamento Social**: Compartilhar resultados no Twitter/Facebook
6. **Dark Mode**: Toggle entre temas claro/escuro
7. **Histórico**: Salvar frases testadas anteriormente

---

## 📄 Licença

```
MIT License

Copyright (c) 2024 Desafio Genjutsu

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🎬 Créditos

### Inspiração
- **Anime/Mangá**: Naruto de **Masashi Kishimoto**
- **Personagem**: Itachi Uchiha
- **Técnica**: Tsukuyomi (Genjutsu)

### Tecnologias
- Font: [Google Fonts](https://fonts.google.com/) (Lato, Roboto)
- Animação de botões: [Robin Dela](https://github.com/robin-dela/css-mask-animation)
- Ícones: Emoji nativos

---

## 👤 Autor [LuizFXdev](https://www.linkedin.com/in/luizfxdev)

- 📧 Email: [luizfx.dev@gmail.com]
- 🐛 Issues: [GitHub Issues](../../issues)
- 💬 Discussões: [GitHub Discussions](../../discussions)

---

<div align="center">

**Feito com 🔥 para fãs de Naruto e desafios de programação!**

[![Naruto](https://img.shields.io/badge/Believe%20It!-Dattebayo-orange?style=for-the-badge)](https://naruto.fandom.com/wiki/Itachi_Uchiha)

*"Aqueles que fogem de suas responsabilidades são piores que lixo."* — **Obito Uchiha**

</div>
