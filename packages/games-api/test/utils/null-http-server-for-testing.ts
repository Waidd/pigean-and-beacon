import {type INestApplication, ValidationPipe} from '@nestjs/common';
import {Test} from '@nestjs/testing';
import supertest from 'supertest';

export class NullHttpServerForTesting {
	public static async create(
		module: any,
		providerToOverrideToken: any,
		providerToOverrideValue: any,
	): Promise<NullHttpServerForTesting> {
		const server = new NullHttpServerForTesting();
		await server.start(
			module,
			providerToOverrideToken,
			providerToOverrideValue,
		);
		return server;
	}

	private _app: INestApplication | undefined;

	public async start(
		module: any,
		providerToOverrideToken: any,
		providerToOverrideValue: any,
	): Promise<void> {
		const moduleRef = await Test.createTestingModule({
			imports: [module],
		})
			.overrideProvider(providerToOverrideToken)
			.useValue(providerToOverrideValue)
			.compile();

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
