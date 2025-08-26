import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async validateUsuario(email: string, senha: string): Promise<any> {
    const usuario = await this.usuariosService.buscarPorEmail(email);
    if (usuario && (await bcrypt.compare(senha, usuario.senha))) {
      const { senha, ...result } = usuario;
      return result;
    }
    return null;
  }

  async login(usuario: any) {
    const payload = { email: usuario.email, sub: usuario.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}