import {closeClient, getClient} from '../../../../src/database.js';
import {PlayerRepository} from '../../../../src/app/player/infrastructure/player.repository.js';

describe('PlayerRepository - integration test', () => {
	const playerRepository = PlayerRepository.create();

	afterEach(async () => {
		const client = await getClient();
		await client.query('DELETE FROM player_;');
	});

	afterAll(async () => {
		await closeClient();
	});

	describe('save', () => {
		it('should save a player', async () => {
			// Given
			const player = {
				email: 'foo@bar.com',
				hash: 'some-secret-hash',
				displayName: 'Foo Bar',
			};

			// When
			await playerRepository.save(player);

			// Then
			const client = await getClient();
			const result = await client.query(`SELECT * FROM player_;`);

			expect(result.rows).toEqual([
				{
					id: expect.any(Number) as number,
					created_at: expect.any(Date) as Date,
					updated_at: expect.any(Date) as Date,
					email: player.email,
					hash: player.hash,
					display_name: player.displayName,
				},
			]);
		});
	});
});
