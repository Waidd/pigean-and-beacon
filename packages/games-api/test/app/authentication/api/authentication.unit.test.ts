import {AuthenticationModule} from '../../../../src/app/authentication/api/authentication.module.js';
import {AuthenticationContainer} from '../../../../src/app/authentication/api/authentication.container.js';
import {SignUpUsecase} from '../../../../src/app/authentication/domain/sign-up.usecase.js';
import {SignInUsecase} from '../../../../src/app/authentication/domain/sign-in.usecase.js';
import {NullHttpServerForTesting} from '../../../utils/null-http-server-for-testing.js';
import {
	PlayerRepository,
	type PlayerSql,
} from '../../../../src/app/player/infrastructure/player.repository.js';
import ConfigurableResponses from '../../../../src/libs/configurable-responses.js';
import OutputTracker from '../../../../src/libs/output-tracker.js';
import {type SqlClientTrackedOutput} from '../../../../src/libs/sql-pool-wrapper.js';

describe('Authentication Controller - unit test', () => {
	let httpServer: NullHttpServerForTesting;
	const configurableResponses = new ConfigurableResponses<PlayerSql>([]);
	const outputTracker = OutputTracker.create<SqlClientTrackedOutput>();
	const playerRepository = PlayerRepository.createNull(
		configurableResponses,
		outputTracker,
	);

	beforeAll(async () => {
		httpServer = await NullHttpServerForTesting.create(
			AuthenticationModule,
			AuthenticationContainer,
			{
				signUp: SignUpUsecase.createNull(playerRepository),
				signIn: SignInUsecase.createNull(playerRepository),
			},
		);
	});

	beforeEach(() => {
		configurableResponses.setResponses([
			{
				label: 'player',
				mode: 'single',
				values: {
					id: 1,
					email: 'foo@bar.com',
					password: 'hashed:some-secret-password',
					display_name: 'Foo Bar',
				},
			},
			{
				label: '*',
				mode: 'single',
				values: undefined,
			},
		]);
	});

	afterEach(() => {
		outputTracker.clear();
	});

	describe('/authentication/signup', () => {
		describe('when everething is ok', () => {
			it('should return the created player', async () => {
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

			it('should write the requested player', async () => {
				// When
				await httpServer.api().post('/authentication/signup').send({
					email: 'foo@bar.com',
					password: 'some-secret-password',
					displayName: 'Foo Bar',
				});

				// Then
				expect(outputTracker.data).toHaveLength(3);
				expect(outputTracker.data[2].values).toEqual([
					'foo@bar.com',
					'hashed:some-secret-password',
					'Foo Bar',
				]);
			});
		});

		describe('when there is an error', () => {
			it('should return an error if fields are missing', async () => {
				// When
				const response = await httpServer
					.api()
					.post('/authentication/signup')
					.send({});

				// Then
				expect(response.statusCode).toBe(400);
				expect(response.body).toEqual({
					error: 'Bad Request',
					message: [
						'email should not be empty',
						'email must be an email',
						'password should not be empty',
						'password must be a string',
						'displayName should not be empty',
						'displayName must be a string',
					],
					statusCode: 400,
				});
			});

			it('should wrap domain errors', async () => {
				// Given
				configurableResponses.setResponses([
					{
						label: '*',
						mode: 'single',
						values: {
							id: 1,
							email: 'foo@bar.com',
							password: 'hashed:some-secret-pasword',
							display_name: 'Foo Bar',
						},
					},
				]);

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
				expect(response.statusCode).toBe(409);
				expect(response.body).toEqual({
					message: 'Email already taken: foo@bar.com',
					statusCode: 409,
				});
			});
		});
	});
});
