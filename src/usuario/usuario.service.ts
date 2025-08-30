import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async criar(email: string, senha: string): Promise<Usuario> {
    const senhaHash = await bcrypt.hash(senha, 10);
    const novoUsuario = this.usuariosRepository.create({ email, senha: senhaHash });
    return this.usuariosRepository.save(novoUsuario);
  }

  async buscarPorEmail(email: string): Promise<Usuario | null> {
    return this.usuariosRepository.findOne({ where: { email } });
  }
}