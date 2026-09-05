const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validarCadastro, DadosInvalidosError } = require('./validarCadastro');

test('caminho feliz: aceita nome, email e senha válidos', () => {
  const resultado = validarCadastro({
    name: 'Maria Silva',
    email: 'Maria@Empresa.com',
    password: 'segredo123',
  });
  assert.equal(resultado.name, 'Maria Silva');
  assert.equal(resultado.email, 'maria@empresa.com'); // normalizado em minúsculas
});

test('rejeita quando nome está ausente', () => {
  assert.throws(
    () => validarCadastro({ email: 'a@b.com', password: '123456' }),
    DadosInvalidosError
  );
});

test('rejeita nome muito curto (menos de 3 caracteres)', () => {
  assert.throws(() =>
    validarCadastro({ name: 'Jo', email: 'a@b.com', password: '123456' })
  );
});

test('rejeita email sem @', () => {
  assert.throws(() =>
    validarCadastro({ name: 'João Pedro', email: 'joao.com', password: '123456' })
  );
});

test('rejeita email sem domínio com ponto', () => {
  assert.throws(() =>
    validarCadastro({ name: 'João Pedro', email: 'joao@empresa', password: '123456' })
  );
});

test('rejeita senha com menos de 6 caracteres', () => {
  assert.throws(() =>
    validarCadastro({ name: 'João Pedro', email: 'joao@empresa.com', password: '12345' })
  );
});

test('aceita senha com exatamente 6 caracteres (fronteira)', () => {
  const resultado = validarCadastro({
    name: 'João Pedro',
    email: 'joao@empresa.com',
    password: '123456',
  });
  assert.equal(resultado.email, 'joao@empresa.com');
});

test('acumula todos os erros de uma vez quando tudo está errado', () => {
  try {
    validarCadastro({ name: '', email: 'invalido', password: '123' });
    assert.fail('deveria ter lançado DadosInvalidosError');
  } catch (err) {
    assert.ok(err instanceof DadosInvalidosError);
    assert.equal(err.erros.length, 3); // nome, email e senha, todos inválidos
  }
});
