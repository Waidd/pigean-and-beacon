import {
	InvalidCredentialsError,
	SignInUsecase,
} from '../../../../src/app/authentication/domain/sign-in.usecase.js';
import {
	PlayerRepository,
	type PlayerSql,
} from '../../../../src/app/player/infrastructure/player.repository.js';
import ConfigurableResponses from '../../../../src/libs/configurable-responses.js';
import OutputTracker from '../../../../src/libs/output-tracker.js';
import {type SqlClientTrackedOutput} from '../../../../src/libs/sql-pool-wrapper.js';

describe('SignInUsecase - unit test', () => {
	it('should return the player if the credentials are valid', async () => {
		// Given
		const signIn = SignInUsecase.createNull();

		// When
		const player = await signIn({
			email: 'foo@bar.com',
			password: 'some-secret-password',
		});

		// Then
		expect(player).toEqual({
			email: 'foo@bar.com',
			password: 'hashed:some-secret-password',
			displayName: 'Foo Bar',
		});
	});

	it('should look for the email in the database', async () => {
		// Given
		const outputTracker = OutputTracker.create<SqlClientTrackedOutput>();
		const playerRepositoryStub = PlayerRepository.createNull(
			undefined,
			outputTracker,
		);
		const signUp = SignInUsecase.createNull(playerRepositoryStub);

		// When
		await signUp({
			email: 'foo@bar.com',
			password: 'some-secret-password',
		});

		// Then
		expect(outputTracker.data).toHaveLength(1);
		expect(outputTracker.data[0].values).toEqual(['foo@bar.com']);
	});

	it('should return an InvalidCredentialsError if the player is not found', async () => {
		// Given
		const playerRepositoryStub = PlayerRepository.createNull(
			new ConfigurableResponses<PlayerSql>([
				{
					label: '*',
					mode: 'single',
					values: undefined,
				},
			]),
		);
		const signUp = SignInUsecase.createNull(playerRepositoryStub);

		// When
		const result = await signUp({
			email: 'foo@bar.com',
			password: 'some-secret-password',
		});

		// Then
		expect(result).toBeInstanceOf(InvalidCredentialsError);
		expect(result).toHaveProperty('message', 'Invalid credentials');
	});
});
