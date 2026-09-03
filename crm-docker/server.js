const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const path = require('path');
const fs = require('fs');

// garante que a pasta data existe (onde o sqlite fica salvo)
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'troque-este-segredo-em-producao';

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// ---------- Middleware de autenticação ----------
function authMiddleware(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'Não autenticado' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Sessão inválida ou expirada' });
  }
}

// ---------- Rotas de API: Auth ----------
app.post('/api/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Preencha nome, email e senha' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'A senha deve ter ao menos 6 caracteres' });
  }

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ error: 'Este email já está cadastrado' });
  }

  const hashed = bcrypt.hashSync(password, 10);
  const info = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(name, email, hashed);

  const token = jwt.sign({ id: info.lastInsertRowid, name, email }, JWT_SECRET, { expiresIn: '2h' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ ok: true, name });
});

app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Informe email e senha' });
  }

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ error: 'Email ou senha inválidos' });
  }

  const token = jwt.sign({ id: user.id, name: user.name, email: user.email }, JWT_SECRET, { expiresIn: '2h' });
  res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
  res.json({ ok: true, name: user.name });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true });
});

app.get('/api/me', authMiddleware, (req, res) => {
  res.json({ name: req.user.name, email: req.user.email });
});

// ---------- Rota de API: dados do CRM (tela inicial) ----------
app.get('/api/clientes', authMiddleware, (req, res) => {
  const clientes = db.prepare('SELECT * FROM clientes').all();
  res.json(clientes);
});

// ---------- Healthcheck (útil pro Azure / Docker) ----------
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`CRM demo rodando em http://localhost:${PORT}`);
});
