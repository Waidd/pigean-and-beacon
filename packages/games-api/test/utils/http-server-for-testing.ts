import {type INestApplication, ValidationPipe} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import supertest from 'supertest';
import {AppModule} from '../../src/app.module.js';

export class HttpServerForTesting {
	private _app: INestApplication | undefined;

	public async start(): Promise<void> {
		const moduleRef = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		this._app = moduleRef.createNestApplication();
		this._app.useGlobalPipes(new ValidationPipe({whitelist: true}));
		await this._app.init();
	}

	public async stop(): Promise<void> {
		await this._app?.close();
	}

	public api(): supertest.SuperTest<supertest.Test> {
		if (!this._app) throw new Error('HttpServerForTesting is not started');
		return supertest(this._app.getHttpServer());
	}
}
