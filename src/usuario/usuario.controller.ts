import { Controller, Post, Body } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { Usuario } from './usuario.entity';

@Controller('usuarios')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async criar(@Body() dadosUsuario: { email: string; senha: string }): Promise<Usuario> {
    return this.usuarioService.criar(dadosUsuario.email, dadosUsuario.senha);
  }
}