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
                productName.textContent = 'Produto não encontrado.';
                return;
            }
            const product = await response.json();
            displayProductDetails(product);
        } catch (error) {
            console.error('Erro ao carregar detalhes do produto:', error);
            productName.textContent = 'Erro ao carregar produto.';
        }
    }

    function displayProductDetails(product) {
        pageTitle.textContent = product.nome;
        productName.textContent = product.nome;

        const precoNumerico = parseFloat(product.preco);
        productPrice.textContent = `R$ ${precoNumerico.toFixed(2)}`;

        productDescription.textContent = product.descricao || '';

        const photos = [product.foto1, product.foto2, product.foto3].filter(Boolean);

        photoGallery.innerHTML = '';

        if (photos.length > 0) {
            const firstPhoto = document.createElement('img');
            firstPhoto.id = 'product-photo';
            firstPhoto.src = photos[0]; // usa direto a URL do Cloudinary
            firstPhoto.alt = product.nome;
            photoGallery.appendChild(firstPhoto);

            if (photos.length > 1) {
                photoIndex = 0;
                clearInterval(photoInterval);
                photoInterval = setInterval(() => {
                    photoIndex = (photoIndex + 1) % photos.length;
                    document.getElementById('product-photo').src = photos[photoIndex];
                }, 5000);
            }
        } else {
            const placeholder = document.createElement('img');
            placeholder.src = "https://via.placeholder.com/600x400";
            placeholder.alt = "Sem foto";
            photoGallery.appendChild(placeholder);
        }

        if (product.video) {
            videoButton.style.display = 'block';
            videoPlayer.src = product.video; // já vem URL completa do backend

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
