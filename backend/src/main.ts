import "reflect-metadata";
import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PrismaService } from "./prisma/prisma.service";

function parseAllowedOrigins(origins?: string): string[] {
  if (!origins) {
    return ["http://localhost:3000"];
  }

  return origins
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const prismaService = app.get(PrismaService);

  app.setGlobalPrefix("api");
  app.enableCors({
    origin: parseAllowedOrigins(process.env.NEST_ALLOWED_ORIGINS),
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );
  await prismaService.enableShutdownHooks(app);

  const port = Number(process.env.API_PORT || 4000);
  await app.listen(port);

  // eslint-disable-next-line no-console
  console.log(`Nest API listening on http://localhost:${port}/api`);
}

bootstrap();