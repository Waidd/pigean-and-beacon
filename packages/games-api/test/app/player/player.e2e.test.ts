import {closeClient, getClient} from '../../../src/database.js';
import {HttpServerForTesting} from '../../utils/http-server-for-testing.js';

describe('Player - E2E test', () => {
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

	describe('/player/me', () => {
		it('should return the current player', async () => {
			// Given
			await httpServer.api().post('/authentication/signup').send({
				email: 'foo@bar.com',
				password: 'some-secret-password',
				displayName: 'Foo Bar',
			});
			const {
				body: {access_token: accessToken},
			} = (await httpServer.api().post('/authentication/signin').send({
				email: 'foo@bar.com',
				password: 'some-secret-password',
			})) as {body: {access_token: string}};

			// When
			const response = await httpServer
				.api()
				.get('/player/me')
				.set('Authorization', `Bearer ${accessToken}`);

			// Then
			expect(response.statusCode).toBe(200);
			expect(response.body).toEqual({
				email: 'foo@bar.com',
				displayName: 'Foo Bar',
			});
		});
	});
});
