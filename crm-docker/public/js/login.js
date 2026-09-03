document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  const errorMsg = document.getElementById('errorMsg');
  errorMsg.style.display = 'none';

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();

    if (!res.ok) {
      errorMsg.textContent = data.error || 'Erro ao entrar';
      errorMsg.style.display = 'block';
      return;
    }

    window.location.href = '/dashboard.html';
  } catch (err) {
    errorMsg.textContent = 'Não foi possível conectar ao servidor';
    errorMsg.style.display = 'block';
  }
});
