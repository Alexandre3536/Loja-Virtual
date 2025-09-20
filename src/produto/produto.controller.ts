import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Delete, 
  Param, 
  Body, 
  NotFoundException, 
  InternalServerErrorException 
} from '@nestjs/common';
import { ProdutoService } from './produto.service';
import { Produto } from './produto.entity';
import { CreateProdutoDto } from './create-produto.dto';

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
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<Produto>, // Aqui o frontend envia preco, descricao, foto1, foto2, foto3, video_url
  ): Promise<Produto> {
    if (!updateData) {
      throw new InternalServerErrorException('Dados de atualização ausentes.');
    }

    const produto = await this.produtoService.update(+id, updateData);
    if (!produto) {
      throw new NotFoundException('Produto não encontrado.');
    }

    return produto;
  }

  @Delete(':id')
  delete(@Param('id') id: string): Promise<void> {
    return this.produtoService.delete(+id);
  }
}
