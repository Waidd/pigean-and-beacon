import {closeClient, getClient} from '../../../src/database.js';
import {HttpServerForTesting} from '../../utils/http-server-for-testing.js';

describe('Authentication - E2E test', () => {
	let httpServer: HttpServerForTesting;

	beforeAll(async () => {
		httpServer = new HttpServerForTesting();
		await httpServer.start();
	});

	afterEach(async () => {
		const sql = getClient();
		await sql.query('DELETE FROM player_;');
	});

	afterAll(async () => {
		await httpServer.stop();
		await closeClient();
	});

	describe('/authentication/signup', () => {
		it('should create and return a player', async () => {
			// When
			const response = await httpServer
				.api()
				.post('/authentication/signup')
				.send({
					email: 'foo@bar.com',
					password: 'some-secret-password',
					displayName: 'Foo Bar',
				});

			// Then
			expect(response.statusCode).toBe(201);
			expect(response.body).toEqual({
				email: 'foo@bar.com',
				displayName: 'Foo Bar',
			});
		});
	});

	describe('/authentication/signin', () => {
		it('should return a authentication token', async () => {
			// Given
			await httpServer.api().post('/authentication/signup').send({
				email: 'foo@bar.com',
				password: 'some-secret-password',
				displayName: 'Foo Bar',
			});

			// When
			const response = await httpServer
				.api()
				.post('/authentication/signin')
				.send({
					email: 'foo@bar.com',
					password: 'some-secret-password',
				});

			// Then
			expect(response.statusCode).toBe(200);
			expect(response.body).toHaveProperty('access_token');
		});
	});
});
