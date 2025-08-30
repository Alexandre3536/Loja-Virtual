import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Usuario } from 'src/usuario/usuario.entity';

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

  async register(usuarioData: Partial<Usuario>): Promise<Usuario> {
    if (!usuarioData.email) {
      throw new InternalServerErrorException('E-mail do usuário não fornecido.');
    }
    
    const usuarioExistente = await this.usuariosService.buscarPorEmail(
      usuarioData.email,
    );

    if (usuarioExistente) {
      throw new UnauthorizedException('Este e-mail já está em uso.');
    }
    
    if (!usuarioData.senha) {
      throw new UnauthorizedException('A senha é obrigatória para o cadastro.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(usuarioData.senha, salt);
    usuarioData.senha = hashedPassword;

    return this.usuariosService.criar(usuarioData.email, usuarioData.senha);
  }
}