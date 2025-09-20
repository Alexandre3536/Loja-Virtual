document.addEventListener('DOMContentLoaded', async () => {
    const productListContainer = document.getElementById('product-list');
    const urlBase = 'https://loja-virtual-1-5c8z.onrender.com/produtos';

    async function fetchProducts() {
        try {
            const response = await fetch(urlBase);
            if (!response.ok) {
                throw new Error('Erro na requisição da API.');
            }
            const products = await response.json();
            displayProducts(products);
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            productListContainer.innerHTML = '<p>Erro ao carregar produtos. Tente novamente mais tarde.</p>';
        }
    }

    function displayProducts(products) {
        if (products.length === 0) {
            productListContainer.innerHTML = '<p>Nenhum produto disponível no momento.</p>';
            return;
        }

        productListContainer.innerHTML = ''; // Limpa o conteúdo antes de adicionar novos produtos

        products.forEach(product => {
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');

            // Agora usa direto a URL do backend (Cloudinary), sem concatenar
            const firstPhoto = product.foto1 
                ? product.foto1 
                : 'https://via.placeholder.com/600x400?text=Sem+foto';

            productCard.innerHTML = `
                <a href="produto_detalhe.html?id=${product.id}">
                    <img src="${firstPhoto}" alt="${product.nome}">
                    <div class="product-info-box">
                        <h2>${product.nome}</h2>
                        <p class="price">R$ ${parseFloat(product.preco).toFixed(2)}</p>
                    </div>
                </a>
            `;
            productListContainer.appendChild(productCard);
        });
    }

    fetchProducts();
});
