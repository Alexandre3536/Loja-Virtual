import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilita CORS
  app.enableCors();

  // Permite que o NestJS sirva arquivos estáticos da pasta 'public'
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Permite que o NestJS sirva arquivos estáticos da pasta 'uploads'
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/', // Define um prefixo para acessar os arquivos de upload
  });

  await app.listen(3000);
}
bootstrap();