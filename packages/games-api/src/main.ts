import * as dotenv from 'dotenv';
import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {AppModule} from './app.module.js';

dotenv.config();

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.useGlobalPipes(new ValidationPipe({whitelist: true}));
	await app.listen(3000);
}

await bootstrap();
