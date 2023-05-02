import {PlayerRepository} from '../../../../src/app/player/infrastructure/player.repository.js';
import {type SqlClientTrackedOutput} from '../../../../src/database.js';
import OutputTracker from '../../../../src/libs/output-tracker.js';

describe('Nulled PlayerRepository - unit test', () => {
	describe('create', () => {
		it('should return a player', async () => {
			// Given
			const playerRepository = PlayerRepository.createNull();

			// When
			const player = await playerRepository.save({
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

		it('should track writen player', async () => {
			// Given
			const outputTracker = OutputTracker.create<SqlClientTrackedOutput>();
			const playerRepository = PlayerRepository.createNull(
				undefined,
				outputTracker,
			);

			// When
			await playerRepository.save({
				email: 'foo2@bar1.com',
				hash: 'some-secret-hash-14',
				displayName: 'Lord Foo Bar',
			});

			// Then
			expect(outputTracker.data).toHaveLength(1);
			expect(outputTracker.data[0].values).toEqual([
				'foo2@bar1.com',
				'some-secret-hash-14',
				'Lord Foo Bar',
			]);
		});
	});
});
