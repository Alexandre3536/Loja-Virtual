document.addEventListener('DOMContentLoaded', async () => {
  const produtoSelect = document.getElementById('produto-select');
  const precoInput = document.getElementById('preco');
  const descricaoInput = document.getElementById('descricao');
  const mediaForm = document.getElementById('media-form');
  const productPhoto = document.getElementById('product-photo');

  // >>>> CONFIGURAÇÃO CLOUDINARY
  const CLOUD_NAME = 'dxbjjkusy';
  const UPLOAD_PRESET = 'imagens';
  const CLOUDINARY_IMAGE_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
  const CLOUDINARY_VIDEO_UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/video/upload`;

  const urlBase = 'https://loja-virtual-1-5c8z.onrender.com/produtos';

  let currentPhotos = [];
  let photoIndex = 0;
  let photoInterval;

  async function carregarProdutos() {
    try {
      const response = await fetch(urlBase);
      if (!response.ok) throw new Error('Erro ao carregar os produtos.');
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
    }
  }

  function changePhoto() {
    if (currentPhotos.length > 0) {
      productPhoto.src = currentPhotos[photoIndex];
      photoIndex = (photoIndex + 1) % currentPhotos.length;
    } else {
      productPhoto.src = '';
    }
  }

  await carregarProdutos();

  produtoSelect.addEventListener('change', async () => {
    const produtoId = produtoSelect.value;
    if (produtoId) {
      try {
        const response = await fetch(`${urlBase}/${produtoId}`);
        if (!response.ok) throw new Error('Produto não encontrado.');
        const produto = await response.json();

        precoInput.value = produto.preco || '';
        descricaoInput.value = produto.descricao || '';

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
      }
    } else {
      precoInput.value = '';
      descricaoInput.value = '';
      productPhoto.src = '';
      clearInterval(photoInterval);
    }
  });

  async function uploadToCloudinary(file, resourceType = 'image') {
    const endpoint = resourceType === 'video'
      ? CLOUDINARY_VIDEO_UPLOAD_URL
      : CLOUDINARY_IMAGE_UPLOAD_URL;

    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', UPLOAD_PRESET);

    const resp = await fetch(endpoint, { method: 'POST', body: fd });
    if (!resp.ok) {
      const t = await resp.text();
      throw new Error(`Falha no upload Cloudinary: ${t}`);
    }
    const data = await resp.json();
    return data.secure_url;
  }

  function isVideoFile(file) {
    return file && file.type && file.type.startsWith('video/');
  }

  mediaForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const produtoId = produtoSelect.value;
    if (!produtoId) return;

    const fotosInput = document.getElementById('fotos');
    const videoInput = document.getElementById('video');

    const urlsFotos = [];
    let urlVideo = '';

    try {
      // Upload imagens
      if (fotosInput.files.length > 0) {
        const files = Array.from(fotosInput.files).slice(0, 3);
        for (const file of files) {
          const url = await uploadToCloudinary(file, 'image');
          urlsFotos.push(url);
        }
      }

      // Upload vídeo
      if (videoInput.files[0]) {
        const file = videoInput.files[0];
        const url = await uploadToCloudinary(file, isVideoFile(file) ? 'video' : 'image');
        urlVideo = url;
      }

      // Monta o JSON
      const body = {
        preco: precoInput.value,
        descricao: descricaoInput.value,
        foto1: urlsFotos[0] || undefined,
        foto2: urlsFotos[1] || undefined,
        foto3: urlsFotos[2] || undefined,
        video_url: urlVideo || undefined,
      };

      // Envia JSON para o back-end
      const response = await fetch(`${urlBase}/${produtoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        mediaForm.reset();
        precoInput.value = '';
        descricaoInput.value = '';
        await carregarProdutos();
        clearInterval(photoInterval);
        productPhoto.src = '';
      } else {
        const errorText = await response.text();
        console.error('Erro ao atualizar o produto:', errorText);
      }
    } catch (error) {
      console.error('Erro no upload/atualização:', error);
    }
  });
});
