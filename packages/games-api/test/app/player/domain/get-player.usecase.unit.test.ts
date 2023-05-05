import {
	GetPlayerUsecase,
	PlayerNotFoundError,
} from '../../../../src/app/player/domain/get-player.usecase.js';
import {
	PlayerRepository,
	type PlayerSql,
} from '../../../../src/app/player/infrastructure/player.repository.js';
import ConfigurableResponses from '../../../../src/libs/configurable-responses.js';
import OutputTracker from '../../../../src/libs/output-tracker.js';
import {type SqlClientTrackedOutput} from '../../../../src/libs/sql-pool-wrapper.js';

describe('GetPlayerUsecase - unit test', () => {
	it('should return the player', async () => {
		// Given
		const getPlayer = GetPlayerUsecase.createNull();

		// When
		const player = await getPlayer('foo@bar.com');

		// Then
		expect(player).toEqual({
			email: 'foo@bar.com',
			password: 'hashed:some-secret-password',
			displayName: 'Foo Bar',
		});
	});

	it('should look for the requested email in the database', async () => {
		// Given
		const outputTracker = OutputTracker.create<SqlClientTrackedOutput>();
		const playerRepositoryStub = PlayerRepository.createNull(
			undefined,
			outputTracker,
		);
		const getPlayer = GetPlayerUsecase.createNull(playerRepositoryStub);

		// When
		await getPlayer('foo@bar.com');

		// Then
		expect(outputTracker.data).toHaveLength(1);
		expect(outputTracker.data[0].values).toEqual(['foo@bar.com']);
	});

	it('should return a PlayerNotFoundError if the player is not found', async () => {
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
		const getPlayer = GetPlayerUsecase.createNull(playerRepositoryStub);

		// When
		const error = await getPlayer('any@email.com');

		// Then
		expect(error).toBeInstanceOf(PlayerNotFoundError);
		expect(error).toHaveProperty(
			'message',
			'No player found with email: any@email.com',
		);
	});
});
