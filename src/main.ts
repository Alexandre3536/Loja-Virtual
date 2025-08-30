import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Habilita CORS
  app.enableCors();

  // Permite que o NestJS sirva arquivos estáticos da pasta 'public'
  // OBS: Essa linha não é necessária se seu frontend for servido pelo Vercel.
  app.useStaticAssets(join(__dirname, '..', 'public'));

  // Permite que o NestJS sirva arquivos estáticos da pasta 'uploads'
  // IMPORTANTE: Em ambientes como o Render, a pasta 'uploads' não é persistente.
  // Os arquivos serão apagados a cada reinício do servidor. Para uma solução
  // em produção, você deve usar um serviço de armazenamento em nuvem como Amazon S3.
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // A porta agora é dinâmica, usando a variável de ambiente que o Render irá fornecer
  await app.listen(process.env.PORT || 3000);
}
bootstrap();