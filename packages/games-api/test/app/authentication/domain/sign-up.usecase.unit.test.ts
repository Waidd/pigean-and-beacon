import {
	DisplayNameAlreadyTakenError,
	EmailAlreadyExistsError,
	SignUpUsecase,
} from '../../../../src/app/authentication/domain/sign-up.usecase.js';
import {
	PlayerRepository,
	type PlayerSql,
} from '../../../../src/app/player/infrastructure/player.repository.js';
import ConfigurableResponses from '../../../../src/libs/configurable-responses.js';
import OutputTracker from '../../../../src/libs/output-tracker.js';
import {type SqlClientTrackedOutput} from '../../../../src/libs/sql-pool-wrapper.js';

describe('SignUpUsecase - unit test', () => {
	it('should return the created player', async () => {
		// Given
		const signUp = SignUpUsecase.createNull();

		// When
		const player = await signUp({
			email: 'foo@bar.com',
			password: 'some-secret-password',
			displayName: 'Foo Bar',
		});

		// Then
		expect(player).toEqual({
			email: 'foo@bar.com',
			password: 'hashed:some-secret-password',
			displayName: 'Foo Bar',
		});
	});

	it('should write the player in the database', async () => {
		// Given
		const outputTracker = OutputTracker.create<SqlClientTrackedOutput>();
		const playerRepositoryStub = PlayerRepository.createNull(
			undefined,
			outputTracker,
		);
		const signUp = SignUpUsecase.createNull(playerRepositoryStub);

		// When
		await signUp({
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

	it('should return an EmailAlreadyExistsError if the email is already taken', async () => {
		// Given
		const playerRepositoryStub = PlayerRepository.createNull(
			new ConfigurableResponses<PlayerSql>([
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
			]),
		);
		const signUp = SignUpUsecase.createNull(playerRepositoryStub);

		// When
		const result = await signUp({
			email: 'foo@bar.com',
			password: 'some-secret-pasword',
			displayName: 'Foo Bar',
		});

		// Then
		expect(result).toBeInstanceOf(EmailAlreadyExistsError);
		expect(result).toHaveProperty(
			'message',
			'Email already taken: foo@bar.com',
		);
	});

	it('should return a DisplaynameAlreadyExistsError if the display name is already taken', async () => {
		// Given
		const playerRepositoryStub = PlayerRepository.createNull(
			new ConfigurableResponses<PlayerSql>([
				{
					label: '*',
					mode: 'array',
					values: [
						undefined,
						{
							id: 1,
							email: 'foo@bar.com',
							password: 'hashed:some-secret-pasword',
							display_name: 'Foo Bar',
						},
					],
				},
			]),
		);
		const signUp = SignUpUsecase.createNull(playerRepositoryStub);

		// When
		const result = await signUp({
			email: 'foo@bar.com',
			password: 'some-secret-pasword',
			displayName: 'Foo Bar',
		});

		// Then
		expect(result).toBeInstanceOf(DisplayNameAlreadyTakenError);
		expect(result).toHaveProperty(
			'message',
			'Display name already taken: Foo Bar',
		);
	});
});
