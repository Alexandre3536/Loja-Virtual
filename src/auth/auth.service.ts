import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsuarioService } from '../usuario/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { Usuario } from '../usuario/usuario.entity';
import { CreateUsuarioDto } from '../usuario/create-usuario.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
  ) {}

  async register(usuarioData: Partial<Usuario>): Promise<Usuario> {
    const { email, senha, nome } = usuarioData;

    // validação obrigatória
    if (!email || !senha) {
      throw new BadRequestException('Email e senha são obrigatórios');
    }

    const existing = await this.usuarioService.findByEmail(email);
    if (existing) throw new UnauthorizedException('Email já cadastrado');

    const dto: CreateUsuarioDto = { email, senha, nome };
    return this.usuarioService.create(dto);
  }

  async validateUsuario(email: string, senha: string): Promise<Usuario | null> {
    const usuario = await this.usuarioService.findByEmail(email);
    if (!usuario) return null;

    const valid = await this.usuarioService.validatePassword(usuario, senha);
    return valid ? usuario : null;
  }

  async login(usuario: Usuario) {
    const payload = { sub: usuario.id, email: usuario.email };
    return { access_token: this.jwtService.sign(payload) };
  }
}
