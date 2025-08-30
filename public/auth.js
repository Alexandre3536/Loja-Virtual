const API_BASE_URL = 'https://loja-virtual-1-5c8z.onrender.com';

const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const loginMessage = document.getElementById('login-message');
const registerMessage = document.getElementById('register-message');

// --- Função para fazer login ---
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('login-email').value;
  const senha = document.getElementById('login-senha').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      // Login bem-sucedido
      localStorage.setItem('access_token', data.access_token);
      window.location.href = '/index.html'; // Redireciona para página principal
    } else {
      loginMessage.textContent = data.error || 'Credenciais inválidas. Tente novamente.';
      loginMessage.style.color = 'red';
    }
  } catch (err) {
    loginMessage.textContent = 'Erro de conexão. Tente novamente.';
    loginMessage.style.color = 'red';
  }
});

// --- Função para cadastrar ---
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('register-email').value;
  const senha = document.getElementById('register-senha').value;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/cadastro`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });

    const data = await response.json();

    if (response.ok && data.access_token) {
      // Cadastro bem-sucedido
      localStorage.setItem('access_token', data.access_token);
      registerMessage.textContent = 'Usuário cadastrado com sucesso!';
      registerMessage.style.color = 'green';
      registerForm.reset();
      // Opcional: redirecionar automaticamente após cadastro
      // window.location.href = '/index.html';
    } else {
      registerMessage.textContent = data.error || 'Erro ao cadastrar. Tente novamente.';
      registerMessage.style.color = 'red';
    }
  } catch (err) {
    registerMessage.textContent = 'Erro de conexão. Tente novamente.';
    registerMessage.style.color = 'red';
  }
});
