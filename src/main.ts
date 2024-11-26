import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  // Habilitar CORS
  app.enableCors({
    origin: '*', // Permite todas as origens. Em produção, especifique as origens permitidas.
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept, Authorization',
    credentials: true, // Habilitar cookies/sessão compartilhada
  })

  // Configuração do Swagger
  const config = new DocumentBuilder()
    .setTitle('Accommodations API')
    .setDescription('API para gerenciar acomodações')
    .setVersion('1.0')
    .addTag('accommodations')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  await app.listen(3333)
}

bootstrap()
