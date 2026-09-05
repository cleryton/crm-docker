// Validação do cadastro (nome, email, senha), separada do server.js
// para poder ser testada sem precisar subir o Express nem o banco.

class DadosInvalidosError extends Error {
  constructor(erros) {
    super('Dados inválidos');
    this.name = 'DadosInvalidosError';
    this.erros = erros; // array de strings, um por problema encontrado
  }
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validarCadastro({ name, email, password } = {}) {
  const erros = [];

  if (!name || typeof name !== 'string' || name.trim().length < 3 || name.trim().length > 80) {
    erros.push('Nome é obrigatório e deve ter entre 3 e 80 caracteres');
  }

  if (!email || typeof email !== 'string' || !EMAIL_REGEX.test(email.trim())) {
    erros.push('Email inválido');
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    erros.push('A senha deve ter ao menos 6 caracteres');
  }

  if (erros.length > 0) {
    throw new DadosInvalidosError(erros);
  }

  return { name: name.trim(), email: email.trim().toLowerCase(), password };
}

module.exports = { validarCadastro, DadosInvalidosError };
