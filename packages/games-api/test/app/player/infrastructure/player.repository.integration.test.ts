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
		const givenPlayer = {
			email: 'foo@bar.com',
			hash: 'some-secret-hash',
			displayName: 'Foo Bar',
		};

		// Then
		it('should save a player in the database', async () => {
			// When
			await playerRepository.save(givenPlayer);

			const client = await getClient();
			const result = await client.query(`SELECT * FROM player_;`);

			expect(result.rows).toEqual([
				{
					id: expect.any(Number) as number,
					created_at: expect.any(Date) as Date,
					updated_at: expect.any(Date) as Date,
					email: givenPlayer.email,
					hash: givenPlayer.hash,
					display_name: givenPlayer.displayName,
				},
			]);
		});

		it('should return the saved player', async () => {
			// When
			const savedPlayer = await playerRepository.save(givenPlayer);

			// Then
			expect(savedPlayer).toEqual(givenPlayer);
		});
	});

	describe('getByEmail', () => {
		const givenPlayer = {
			email: 'foo@bar.com',
			hash: 'some-secret-hash',
			displayName: 'Foo Bar',
		};
		beforeEach(async () => {
			await playerRepository.save(givenPlayer);
		});

		it('should return the player with the given email', async () => {
			// When
			const player = await playerRepository.getByEmail(givenPlayer.email);

			// Then
			expect(player).toEqual(givenPlayer);
		});

		it('should return undefined if no player with the given email exists', async () => {
			// When
			const player = await playerRepository.getByEmail('non-existing-email');

			// Then
			expect(player).toBeUndefined();
		});
	});
});
