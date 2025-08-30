import { TypeOrmModuleOptions } from '@nestjs/typeorm';

const getDatabaseConfig = (): TypeOrmModuleOptions => {
  const isProduction = process.env.NODE_ENV === 'production';
  const dbUrl = process.env.DATABASE_URL;

  if (isProduction && dbUrl) {
    const parsedUrl = new URL(dbUrl);
    return {
      type: 'postgres',
      host: parsedUrl.hostname,
      port: parseInt(parsedUrl.port, 10),
      username: parsedUrl.username,
      password: parsedUrl.password,
      database: parsedUrl.pathname.slice(1),
      ssl: {
        rejectUnauthorized: false,
      } as any, // 👈 cast necessário
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,
    };
  }

  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME || 'seu-usuario',
    password: process.env.DB_PASSWORD || 'sua-senha',
    database: process.env.DB_DATABASE || 'seu-banco',
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: true,
  };
};
