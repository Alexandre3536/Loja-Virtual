document.addEventListener('DOMContentLoaded', async () => {
    const produtoSelect = document.getElementById('produto-select');
    const precoInput = document.getElementById('preco');
    const descricaoInput = document.getElementById('descricao');
    const mediaForm = document.getElementById('media-form');
    const productPhoto = document.getElementById('product-photo');
    const urlBase = 'https://loja-virtual-1-5c8z.onrender.com/produtos';
    const uploadsUrl = 'https://loja-virtual-1-5c8z.onrender.com/uploads';

    let currentPhotos = [];
    let photoIndex = 0;
    let photoInterval;

    // Função para carregar os produtos do backend
    async function carregarProdutos() {
        try {
            const response = await fetch(urlBase);
            if (!response.ok) {
                throw new Error('Erro ao carregar os produtos.');
            }
            const produtos = await response.json();
            
            produtoSelect.innerHTML = '';
            
            const optionDefault = document.createElement('option');
            optionDefault.value = '';
            optionDefault.textContent = 'Selecione um produto';
            produtoSelect.appendChild(optionDefault);

            produtos.forEach(produto => {
                const option = document.createElement('option');
                option.value = produto.id;
                option.textContent = produto.nome;
                produtoSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Erro ao carregar produtos:', error);
            // O alerta de erro foi removido daqui
        }
    }

    // Função para mudar a foto exibida
    function changePhoto() {
        if (currentPhotos.length > 0) {
            productPhoto.src = `${uploadsUrl}/${currentPhotos[photoIndex]}`;
            photoIndex = (photoIndex + 1) % currentPhotos.length;
        } else {
            productPhoto.src = '';
        }
    }

    // Carrega os produtos ao iniciar a página
    await carregarProdutos();

    // Evento para quando o usuário selecionar um produto
    produtoSelect.addEventListener('change', async () => {
        const produtoId = produtoSelect.value;
        if (produtoId) {
            try {
                const response = await fetch(`${urlBase}/${produtoId}`);
                if (!response.ok) {
                    throw new Error('Produto não encontrado.');
                }
                const produto = await response.json();
                
                precoInput.value = produto.preco || '';
                descricaoInput.value = produto.descricao || '';
                
                // Lógica do carrossel
                currentPhotos = [];
                if (produto.foto1) currentPhotos.push(produto.foto1);
                if (produto.foto2) currentPhotos.push(produto.foto2);
                if (produto.foto3) currentPhotos.push(produto.foto3);

                photoIndex = 0;
                clearInterval(photoInterval);

                if (currentPhotos.length > 0) {
                    changePhoto();
                    photoInterval = setInterval(changePhoto, 5000);
                } else {
                    productPhoto.src = '';
                }
            } catch (error) {
                console.error('Erro ao buscar detalhes do produto:', error);
                // O alerta de erro foi removido daqui
            }
        } else {
            precoInput.value = '';
            descricaoInput.value = '';
            productPhoto.src = '';
            clearInterval(photoInterval);
        }
    });

    // Evento para enviar o formulário
    mediaForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const produtoId = produtoSelect.value;
        if (!produtoId) {
            // O alerta de aviso de produto não selecionado foi removido
            return;
        }

        const formData = new FormData();
        const fotosInput = document.getElementById('fotos');
        const videoInput = document.getElementById('video');

        formData.append('preco', precoInput.value);
        formData.append('descricao', descricaoInput.value);

        if (fotosInput.files.length > 0) {
            for (const file of fotosInput.files) {
                formData.append('files', file);
            }
        }

        if (videoInput.files[0]) {
            formData.append('files', videoInput.files[0]);
        }

        try {
            const response = await fetch(`${urlBase}/${produtoId}`, {
                method: 'PUT',
                body: formData,
            });

            if (response.ok) {
                // O alerta de sucesso foi removido
                mediaForm.reset();
                precoInput.value = '';
                descricaoInput.value = '';
                await carregarProdutos();
                clearInterval(photoInterval);
                productPhoto.src = '';
            } else {
                const errorText = await response.text();
                console.error('Erro ao atualizar o produto:', errorText);
                // O alerta de erro foi removido daqui
            }
        } catch (error) {
            console.error('Erro de conexão com o servidor:', error);
            // O alerta de erro de conexão foi removido daqui
        }
    });
});