import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';
import { CreateUsuarioDto } from './create-usuario.dto';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async criar(@Body() dadosUsuario: { email: string; senha: string; nome?: string }): Promise<Usuario> {
    const { email, senha, nome } = dadosUsuario;

    // validação simples
    if (!email || !senha) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }

    const dto: CreateUsuarioDto = { email, senha, nome };
    return this.usuarioService.create(dto);
  }
}
