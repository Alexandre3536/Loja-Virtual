import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Usuario } from '../usuario/usuario.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() dadosLogin: { email: string; senha: string }) {
    const usuario = await this.authService.validateUsuario(
      dadosLogin.email,
      dadosLogin.senha,
    );
    if (!usuario) throw new UnauthorizedException('Credenciais inválidas');
    return this.authService.login(usuario);
  }

  @Post('cadastro')
  async cadastro(@Body() usuarioData: Partial<Usuario>) {
    const usuario = await this.authService.register(usuarioData);
    return this.authService.login(usuario);
  }
}