document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    const productName = document.getElementById('product-name');
    const pageTitle = document.getElementById('page-title');
    const productPrice = document.getElementById('product-price');
    const productDescription = document.getElementById('product-description');
    const photoGallery = document.getElementById('photo-gallery');
    const videoButton = document.getElementById('video-button');
    const videoPlayer = document.createElement('video');
    videoPlayer.controls = true;

    const urlBase = 'https://loja-virtual-1-5c8z.onrender.com/produtos';
    const uploadsUrl = 'https://loja-virtual-1-5c8z.onrender.com/uploads';

    let photoIndex = 0;
    let photoInterval;

    if (!productId) {
        productName.textContent = 'Produto não encontrado.';
        return;
    }

    async function fetchProductDetails() {
        try {
            const response = await fetch(`${urlBase}/${productId}`);
            if (!response.ok) {
                // Se a resposta não for OK (ex: 404 Not Found), exibe esta mensagem
                productName.textContent = 'Produto não encontrado.';
                return;
            }
            const product = await response.json();
            displayProductDetails(product);
        } catch (error) {
            console.error('Erro ao carregar detalhes do produto:', error);
            // Exibe uma mensagem de erro genérica em caso de falha na requisição
            productName.textContent = 'Erro ao carregar produto.';
        }
    }

    function displayProductDetails(product) {
        pageTitle.textContent = product.nome;
        productName.textContent = product.nome;

        // CONSERTO PRINCIPAL: Converte a string do preço para um número
        const precoNumerico = parseFloat(product.preco);
        productPrice.textContent = `R$ ${precoNumerico.toFixed(2)}`;

        productDescription.textContent = product.descricao || '';

        const photos = [product.foto1, product.foto2, product.foto3].filter(Boolean);
        
        photoGallery.innerHTML = ''; // Limpa a galeria para recarregar

        if (photos.length > 0) {
            const firstPhoto = document.createElement('img');
            firstPhoto.id = 'product-photo';
            firstPhoto.src = `${uploadsUrl}/${photos[0]}`;
            firstPhoto.alt = product.nome;
            photoGallery.appendChild(firstPhoto);

            if (photos.length > 1) {
                photoIndex = 0;
                // Limpa o intervalo anterior para evitar que várias funções de troca rodem ao mesmo tempo
                clearInterval(photoInterval); 
                photoInterval = setInterval(() => {
                    photoIndex = (photoIndex + 1) % photos.length;
                    document.getElementById('product-photo').src = `${uploadsUrl}/${photos[photoIndex]}`;
                }, 5000);
            }
        } else {
            // Se não houver fotos, exibe uma imagem placeholder
            const placeholder = document.createElement('img');
            placeholder.src = "https://via.placeholder.com/600x400";
            placeholder.alt = "Sem foto";
            photoGallery.appendChild(placeholder);
        }
        
        if (product.video) {
            videoButton.style.display = 'block';
            videoPlayer.src = `${uploadsUrl}/${product.video}`;
            
            // Remove qualquer listener de clique anterior antes de adicionar um novo
            const oldVideoButton = videoButton.cloneNode(true);
            videoButton.parentNode.replaceChild(oldVideoButton, videoButton);

            oldVideoButton.addEventListener('click', async () => {
                if ('pictureInPictureEnabled' in document) {
                    try {
                        await videoPlayer.requestPictureInPicture();
                        videoPlayer.play();
                    } catch (error) {
                        console.error('Erro ao tentar Picture-in-Picture:', error);
                    }
                } else {
                    alert('Seu navegador não suporta Picture-in-Picture.');
                }
            });
        }
    }

    fetchProductDetails();
});