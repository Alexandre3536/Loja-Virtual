Loja Virtual - MVP
Descrição do projeto

Projeto de loja virtual desenvolvido como MVP acadêmico. Permite cadastro de produtos, upload de imagens e vídeos, visualização detalhada de cada produto e atualização de informações de produtos.

Tecnologias utilizadas

Backend: NestJS, TypeORM, PostgreSQL

Frontend: HTML, CSS, JavaScript

Hospedagem: Render (backend)

Upload de mídias: Cloudinary

Instalação local

Clone o repositório:

git clone <link-do-repositorio>
cd <nome-do-projeto>


Instale as dependências:

npm install


Configure as variáveis de ambiente .env (exemplo):

DB_HOST=<host-do-banco>
DB_PORT=5432
DB_USERNAME=<usuario-do-banco>
DB_PASSWORD=<senha-do-banco>
DB_DATABASE=<nome-do-banco>
CLOUDINARY_CLOUD_NAME=<cloud_name>
CLOUDINARY_UPLOAD_PRESET=<upload_preset>


Rode o projeto:

# modo desenvolvimento
npm run start:dev

# modo produção
npm run start:prod

Deploy

O projeto está hospedado em Render:
https://loja-virtual-1-5c8z.onrender.com/login.html

Para acrescentar as fotos:

https://loja-virtual-1-5c8z.onrender.com/media.html


Para o Cliente consultar os produtos:

https://loja-virtual-1-5c8z.onrender.com/produtos.html

Versionamento

Tag de versão: v1.0.0

Histórico de commits organizado no repositório Git.

Funcionalidades principais

Listagem de produtos

Detalhes de produto com imagens e vídeos

Upload de imagens e vídeos via Cloudinary

Atualização de informações de produtos

Observações

O upload de vídeos pode demorar dependendo do tamanho do arquivo

Para testes locais, configure corretamente o banco de dados e o Cloudinary
