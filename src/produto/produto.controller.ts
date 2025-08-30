/// <reference types="express" />
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ProdutoService } from './produto.service';
import { Produto } from './produto.entity';
import { diskStorage } from 'multer';
import * as path from 'path';

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
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename = `${Date.now()}-${file.originalname}`;
        cb(null, filename);
      },
    }),
  }))
  async create(
    @Body() produtoData: Partial<Produto>,
    @UploadedFile() file: Express.Multer.File,
  ): Promise<Produto> {
    if (!file) {
      throw new InternalServerErrorException('Nenhuma imagem enviada.');
    }

    try {
      const produto = new Produto();
      
      produto.nome = produtoData.nome || '';
      produto.descricao = produtoData.descricao || '';
      produto.preco = Number(produtoData.preco) || 0;
      produto.foto1 = file.filename;
      
      return this.produtoService.create(produto);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao processar os dados.');
    }
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
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Produto>,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    if (!updateData) {
      throw new InternalServerErrorException('Dados de atualização ausentes.');
    }
    
    return this.produtoService.update(+id, updateData, files);
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.produtoService.delete(+id);
  }
}