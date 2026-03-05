# 📚 Canvas WhatsApp Notification Bot

> Bot que monitora automaticamente suas disciplinas no Canvas LMS e envia notificações pelo WhatsApp quando novas atividades ou quizzes são publicados.

---

## ✨ Funcionalidades

- 🔔 Notificações em tempo real de novas **atividades** e **quizzes**
- ⏱️ Verificação automática a cada **5 minutos**
- 💬 Mensagens formatadas direto no seu **WhatsApp**
- 🗃️ Banco de dados local para evitar notificações duplicadas
- 🔄 Reconexão automática do WhatsApp em caso de queda

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| [Node.js](https://nodejs.org) | Runtime |
| [Baileys](https://github.com/WhiskeySockets/Baileys) | Integração com WhatsApp |
| [Axios](https://axios-http.com) | Requisições à API do Canvas |
| [node-cron](https://github.com/node-cron/node-cron) | Agendamento de tarefas |
| [better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | Banco de dados local |

---

## 📋 Pré-requisitos

- [Node.js](https://nodejs.org) v18 ou superior
- Conta no [Canvas LMS](https://canvas.instructure.com)
- WhatsApp instalado no celular

---

## ⚙️ Configuração

### 1. Clone o repositório

```bash
git clone https://github.com/seuusuario/notification-bot.git
cd notification-bot
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
CANVAS_URL=https://suainstituicao.instructure.com
CANVAS_TOKEN=seu_token_aqui
WA_NUMBER=5511999999999@s.whatsapp.net
```

#### Como obter o Token do Canvas

1. Acesse o Canvas e vá em **Configurações da Conta**
2. Role até **Tokens de Acesso**
3. Clique em **+ Token de Acesso**
4. Dê um nome e clique em **Gerar Token**
5. Copie o token gerado

#### Como obter os IDs dos cursos

Acesse cada curso pelo Canvas e copie o número da URL:

```
https://suainstituicao.instructure.com/courses/17562
                                                ^^^^^
                                            esse é o ID
```

#### Formato do número do WhatsApp

```
55       11       999999999  @s.whatsapp.net
(Brasil) (DDD)   (número)
```

### 4. Configure os cursos no código

Abra o `index.js` e adicione os IDs dos seus cursos:

```javascript
const COURSE_IDS = [17562, 18934, 20011]; // seus IDs reais
```

---

## 🚀 Como usar

### Rodando localmente

```bash
npm start
```

Na primeira execução, um **QR Code** aparecerá no terminal. Escaneie com o WhatsApp:

1. Abra o WhatsApp no celular
2. Vá em **Dispositivos conectados**
3. Toque em **Conectar dispositivo**
4. Escaneie o QR Code

A sessão ficará salva na pasta `auth_info/` — você não precisará escanear novamente.

### Mantendo rodando em segundo plano (local)

```bash
npm install -g pm2
pm2 start index.js --name "canvas-bot"
pm2 save
```

---

## ☁️ Deploy no Render

1. Faça o push do projeto para o GitHub
2. Acesse [render.com](https://render.com) e crie uma conta
3. Clique em **New +** → **Background Worker**
4. Conecte seu repositório
5. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
6. Adicione as variáveis de ambiente na aba **Environment**
7. Clique em **Deploy**

---

## 📁 Estrutura do projeto

```
notification-bot/
├── index.js          # Arquivo principal, agendamento do cron
├── canvas.js         # Integração com a API do Canvas
├── whatsapp.js       # Conexão e envio de mensagens via WhatsApp
├── database.js       # Controle de notificações já enviadas
├── formatter.js      # Formatação das mensagens
├── package.json      # Dependências do projeto
├── .env              # Variáveis de ambiente (não sobe pro GitHub)
└── .gitignore        # Arquivos ignorados pelo Git
```

---

## 🔒 Segurança

- Nunca compartilhe seu arquivo `.env`
- Nunca commite a pasta `auth_info/` (sessão do WhatsApp)
- O `.gitignore` já está configurado para ignorar esses arquivos

---

## 📬 Exemplo de notificação

```
📚 Nova Atividade!

Trabalho Final - Engenharia de Software
📅 Entrega: 20/03/2026, 23:59
🔗 https://facens.instructure.com/courses/17562/assignments/...
```

```
📝 Novo Quiz!

Quiz 3 - Estruturas de Dados
📅 Entrega: 18/03/2026, 18:00
🔗 https://facens.instructure.com/courses/17562/quizzes/...
```

---

## 🐛 Problemas comuns

| Erro | Solução |
|---|---|
| `CANVAS_URL: undefined` | Verifique as variáveis de ambiente na plataforma de deploy |
| `Error 404` em um curso | O curso não possui atividades ou quizzes cadastrados |
| QR Code não aparece | Delete a pasta `auth_info/` e reinicie o bot |
| WhatsApp desconectado | O bot reconecta automaticamente; se não, reinicie |

---

## 📄 Licença

MIT © 2026
