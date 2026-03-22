import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as admin from 'firebase-admin';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  // Initialize Firebase Admin (in production, use GOOGLE_APPLICATION_CREDENTIALS)
  // We'll catch and ignore errors in case credentials aren't provided yet
  try {
    admin.initializeApp();
    console.log('Firebase Admin initialized automatically context');
  } catch (error) {
    console.error('Firebase Admin initialization failed. Ensure credentials are set.', error);
  }

  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Backend running on http://localhost:${port}`);
}
bootstrap();
