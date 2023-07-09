import {NestFactory} from '@nestjs/core';
import {ValidationPipe} from '@nestjs/common';
import {SwaggerModule, DocumentBuilder} from '@nestjs/swagger';
import {AppModule} from './app.module.js';
import {configuration} from './configuration.js';

async function bootstrap() {
	const app = await NestFactory.create(AppModule);

	app.useGlobalPipes(new ValidationPipe({whitelist: true}));

	const config = new DocumentBuilder()
		.setTitle('Games API')
		.setDescription('Games API description')
		.setVersion(configuration.npm_package_version)
		.addBearerAuth()
		.build();
	const document = SwaggerModule.createDocument(app, config);
	SwaggerModule.setup('api', app, document, {
		swaggerOptions: {
			tagsSorter: 'alpha',
			operationsSorter: 'alpha',
		},
	});

	await app.listen(3000);
}

await bootstrap();
