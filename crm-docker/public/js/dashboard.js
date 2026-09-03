async function init() {
  try {
    const meRes = await fetch('/api/me');
    if (!meRes.ok) {
      window.location.href = '/login.html';
      return;
    }
    const me = await meRes.json();
    document.getElementById('userName').textContent = me.name;

    const clientesRes = await fetch('/api/clientes');
    const clientes = await clientesRes.json();

    const ativos = clientes.filter(c => c.status === 'Ativo').length;
    const negociacao = clientes.filter(c => c.status === 'Negociação').length;

    document.getElementById('statAtivos').textContent = ativos;
    document.getElementById('statNegociacao').textContent = negociacao;
    document.getElementById('statTotal').textContent = clientes.length;

    const tbody = document.getElementById('clientesBody');
    tbody.innerHTML = clientes.map(c => {
      const badgeClass = c.status === 'Ativo' ? 'ativo' : (c.status === 'Negociação' ? 'negociacao' : 'inativo');
      return `<tr>
        <td>${c.nome}</td>
        <td>${c.empresa || '-'}</td>
        <td><span class="badge ${badgeClass}">${c.status}</span></td>
      </tr>`;
    }).join('');
  } catch (err) {
    window.location.href = '/login.html';
  }
}

document.getElementById('logoutBtn').addEventListener('click', async () => {
  await fetch('/api/logout', { method: 'POST' });
  window.location.href = '/login.html';
});

init();
