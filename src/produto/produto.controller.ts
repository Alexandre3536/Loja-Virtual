import { CreateProdutoDto } from './create-produto.dto';

import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UploadedFiles,
  UseInterceptors,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
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
  create(@Body() createProdutoDto: CreateProdutoDto): Promise<Produto> {
    return this.produtoService.create(createProdutoDto);
  }

  @Put(':id')
  @UseInterceptors(
    FilesInterceptor('files', 5, {
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