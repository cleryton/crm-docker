const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'crm.db');
const db = new Database(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS clientes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    empresa TEXT,
    status TEXT DEFAULT 'Ativo'
  );
`);

// Dados de exemplo para a tela inicial do CRM (só popula se estiver vazio)
const count = db.prepare('SELECT COUNT(*) AS c FROM clientes').get().c;
if (count === 0) {
  const insert = db.prepare('INSERT INTO clientes (nome, empresa, status) VALUES (?, ?, ?)');
  insert.run('Ana Souza', 'Nimbus Tech', 'Ativo');
  insert.run('Carlos Lima', 'Vertex Log', 'Negociação');
  insert.run('Beatriz Alves', 'Orbita SA', 'Ativo');
  insert.run('João Pedro', 'Aurora Ind.', 'Inativo');
}

module.exports = db;
