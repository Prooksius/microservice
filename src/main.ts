import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'math',
        protoPath: join(process.cwd(), 'src/math.proto'),
        url: 'localhost:4000',
      },
    },
  );
  await app.listen();
  // const app = await NestFactory.create(AppModule);
  // await app.listen(3000); et4tgwnkejfew
}
bootstrap();
