<<<<<<< HEAD
// src/produto/produto.controller.ts
=======
>>>>>>> ce108b0feba30ccbe1c717a221f96cc8afa914c6
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
<<<<<<< HEAD
=======
  UploadedFile,
>>>>>>> ce108b0feba30ccbe1c717a221f96cc8afa914c6
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
<<<<<<< HEAD
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProdutoService } from './produto.service';
import { Produto } from './produto.entity';
import { diskStorage } from 'multer';
import * as path from 'path';
=======
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProdutoService } from './produto.service';
import { Produto } from './produto.entity';
import { cloudinary } from '../cloudinary/cloudinary.config';
>>>>>>> ce108b0feba30ccbe1c717a221f96cc8afa914c6

@Controller('produtos')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @Get()
  findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Produto> {
    return this.produtoService.findOne(+id);
  }

  @Post()
<<<<<<< HEAD
  create(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.create(produto);
  }

  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('files', 5, { // 'files' é o nome do campo no seu FormData
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  )
=======
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Body() produtoData: Partial<Produto>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Produto> {
    if (!file) {
      throw new InternalServerErrorException('Nenhuma imagem enviada.');
    }

    try {
      // 1. Envia a imagem para o Cloudinary
      const result = await cloudinary.uploader.upload(file.path);

      const produto = new Produto();
      
      // 2. Garante que os valores do corpo são strings
      produto.nome = produtoData.nome || '';
      produto.descricao = produtoData.descricao || '';
      
      // 3. Converte o preço para número (evita erro de tipo)
      produto.preco = Number(produtoData.preco) || 0;
      
      // 4. Salva a URL da imagem no banco de dados
      produto.foto1 = result.secure_url;
      
      return this.produtoService.create(produto);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao fazer upload da imagem ou processar os dados.');
    }
  }

  @Put(':id')
  @UseInterceptors(FilesInterceptor('files', 5))
>>>>>>> ce108b0feba30ccbe1c717a221f96cc8afa914c6
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Produto>,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!updateData) {
      throw new InternalServerErrorException('Dados de atualização ausentes.');
    }
<<<<<<< HEAD
=======
    
    if (files && files.length > 0) {
      try {
        const uploadPromises = files.map(file => cloudinary.uploader.upload(file.path));
        const results = await Promise.all(uploadPromises);
        
        if (results.length > 0) {
            updateData.foto1 = results[0].secure_url;
        }
      } catch (error) {
          throw new InternalServerErrorException('Erro ao fazer upload das imagens para o Cloudinary.');
      }
    }

>>>>>>> ce108b0feba30ccbe1c717a221f96cc8afa914c6
    return this.produtoService.update(+id, updateData, files);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.produtoService.delete(+id);
  }
}