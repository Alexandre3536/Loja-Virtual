const API_URL = 'https://loja-virtual-1-5c8z.onrender.com/produtos';

const produtoForm = document.getElementById('produtoForm');
const produtosTable = document.getElementById('produtosTable').getElementsByTagName('tbody')[0];
const produtoIdInput = document.getElementById('produtoId');
const nomeInput = document.getElementById('nome');
const descricaoInput = document.getElementById('descricao');
const precoInput = document.getElementById('preco');
const token = localStorage.getItem('access_token');

// Verifica se o token existe. Se não, redireciona para a página de login.
if (!token) {
  window.location.href = '/login.html';
}

// Configura os headers de autenticação para as requisições
const authHeaders = {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`
};

// Função para buscar e exibir os produtos
async function fetchProdutos() {
  const response = await fetch(API_URL);
  const produtos = await response.json();
  produtosTable.innerHTML = '';
  produtos.forEach(produto => {
    const row = produtosTable.insertRow();
    row.innerHTML = `
      <td>${produto.id}</td>
      <td>${produto.nome}</td>
      <td>${produto.descricao}</td>
      <td>${produto.preco}</td>
      <td class="actions">
        <button onclick="editProduto(${produto.id}, '${produto.nome}', '${produto.descricao}', ${produto.preco})">Editar</button>
        <button onclick="deleteProduto(${produto.id})">Excluir</button>
      </td>
    `;
  });
}

// Função para enviar o formulário (criar ou atualizar)
produtoForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const produto = {
    nome: nomeInput.value,
    descricao: descricaoInput.value,
    preco: parseFloat(precoInput.value),
  };

  const id = produtoIdInput.value;
  if (id) {
    await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: authHeaders, // Usa os headers de autenticação
      body: JSON.stringify(produto),
    });
  } else {
    await fetch(API_URL, {
      method: 'POST',
      headers: authHeaders, // Usa os headers de autenticação
      body: JSON.stringify(produto),
    });
  }

  produtoForm.reset();
  produtoIdInput.value = '';
  fetchProdutos();
});

// Função para preencher o formulário para edição
function editProduto(id, nome, descricao, preco) {
  produtoIdInput.value = id;
  nomeInput.value = nome;
  descricaoInput.value = descricao;
  precoInput.value = preco;
}

// Função para excluir um produto
async function deleteProduto(id) {
  if (confirm('Tem certeza que deseja excluir este produto?')) {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` } // Usa o header de autenticação
    });
    fetchProdutos();
  }
}

// Carregar os produtos ao iniciar
document.addEventListener('DOMContentLoaded', fetchProdutos);