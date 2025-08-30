import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './create-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepo: Repository<Usuario>,
  ) {}

  // Cria um usuário com hash de senha
  async create(usuarioData: CreateUsuarioDto): Promise<Usuario> {
    const hash = await bcrypt.hash(usuarioData.senha, 10);
    const usuario = this.usuarioRepo.create({ ...usuarioData, senha: hash });
    return this.usuarioRepo.save(usuario);
  }

  // Procura usuário pelo email
  async findByEmail(email: string): Promise<Usuario | null> {
    return this.usuarioRepo.findOne({ where: { email } });
  }

  // Valida senha do usuário
  async validatePassword(usuario: Usuario, senha: string): Promise<boolean> {
    return bcrypt.compare(senha, usuario.senha);
  }
}
