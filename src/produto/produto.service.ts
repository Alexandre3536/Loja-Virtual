// src/produto/produto.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './produto.entity';
import { Express } from 'express';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private produtosRepository: Repository<Produto>,
  ) {}

  async findAll(): Promise<Produto[]> {
    return this.produtosRepository.find();
  }

  async findOne(id: number): Promise<Produto> {
    const produto = await this.produtosRepository.findOneBy({ id });
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    return produto;
  }

  async create(produto: Partial<Produto>): Promise<Produto> {
    const novoProduto = this.produtosRepository.create(produto);
    return this.produtosRepository.save(novoProduto);
  }

  async update(id: number, updateData: Partial<Produto>, files?: Express.Multer.File[]): Promise<Produto> {
    const produto = await this.produtosRepository.findOneBy({ id });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }

    // Aplica os dados do formulário
    Object.assign(produto, updateData);

    // Lógica para lidar com os uploads de arquivos
    if (files && files.length > 0) {
      files.forEach((file) => {
        if (file.mimetype.startsWith('image')) {
          if (!produto.foto1) {
            produto.foto1 = file.filename;
          } else if (!produto.foto2) {
            produto.foto2 = file.filename;
          } else if (!produto.foto3) {
            produto.foto3 = file.filename;
          }
        } else if (file.mimetype.startsWith('video')) {
          produto.video = file.filename;
        }
      });
    }

    return this.produtosRepository.save(produto);
  }

  async delete(id: number): Promise<void> {
    const produto = await this.produtosRepository.findOneBy({ id });
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado.`);
    }
    await this.produtosRepository.remove(produto);
  }
}