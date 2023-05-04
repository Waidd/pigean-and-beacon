import {SignUpUsecase} from '../../../../src/app/authentication/domain/sign-up.usecase.js';
import {PlayerRepository} from '../../../../src/app/player/infrastructure/player.repository.js';
import OutputTracker from '../../../../src/libs/output-tracker.js';
import {type SqlClientTrackedOutput} from '../../../../src/libs/pool-wrapper.js';

describe('SignUpUsecase - unit test', () => {
	it('should return the created player', async () => {
		// Given
		const signUp = SignUpUsecase.createNull();

		// When
		const player = await signUp({
			email: 'foo@bar.com',
			hash: 'some-secret-hash',
			displayName: 'Foo Bar',
		});

		// Then
		expect(player).toEqual({
			email: 'foo@bar.com',
			hash: 'some-secret-hash',
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
			hash: 'some-secret-hash',
			displayName: 'Foo Bar',
		});

		// Then
		expect(outputTracker.data).toHaveLength(3);
		expect(outputTracker.data[2].values).toEqual([
			'foo@bar.com',
			'some-secret-hash',
			'Foo Bar',
		]);
	});
});
