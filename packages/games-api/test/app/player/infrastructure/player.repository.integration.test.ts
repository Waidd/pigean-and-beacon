import {closeClient, getClient} from '../../../../src/database.js';
import {ArgonHashAndVerify} from '../../../../src/libs/hash-and-verify-wrapper.js';
import {
	PlayerRepository,
	type PlayerSql,
} from '../../../../src/app/player/infrastructure/player.repository.js';

describe('PlayerRepository - integration test', () => {
	const playerRepository = PlayerRepository.create();
	const hashAndVerify = new ArgonHashAndVerify();

	afterEach(async () => {
		const sql = getClient();
		await sql.query('DELETE FROM player_;');
	});

	afterAll(async () => {
		await closeClient();
	});

	describe('save', () => {
		const givenPlayer = {
			email: 'foo@bar.com',
			password: 'some-secret-hash',
			displayName: 'Foo Bar',
		};

		// Then
		it('should save a player in the database with a hashed password', async () => {
			// When
			await playerRepository.save(givenPlayer);

			const sql = getClient();
			const result = await sql.query<PlayerSql>(`SELECT * FROM player_;`);

			expect(result.rows).toEqual([
				{
					id: expect.any(Number) as number,
					created_at: expect.any(Date) as Date,
					updated_at: expect.any(Date) as Date,
					email: givenPlayer.email,
					password: expect.any(String) as string,
					display_name: givenPlayer.displayName,
				},
			]);
			expect(
				await hashAndVerify.verify(
					result.rows[0].password,
					givenPlayer.password,
				),
			).toBe(true);
		});

		it('should return the saved player with the hashed password', async () => {
			// When
			const savedPlayer = await playerRepository.save(givenPlayer);

			// Then
			expect(savedPlayer).toEqual({
				...givenPlayer,
				password: expect.any(String) as string,
			});
			expect(
				await hashAndVerify.verify(savedPlayer.password, givenPlayer.password),
			).toBe(true);
		});
	});

	describe('getByEmail', () => {
		const givenPlayer = {
			email: 'foo@bar.com',
			password: 'some-secret-password',
			displayName: 'Foo Bar',
		};
		beforeEach(async () => {
			// Given
			await playerRepository.save(givenPlayer);
		});

		it('should return the player with the given email', async () => {
			// When
			const player = await playerRepository.getByEmail(givenPlayer.email);

			// Then
			expect(player).toEqual({
				...givenPlayer,
				password: expect.any(String) as string,
			});
			expect(
				await hashAndVerify.verify(player!.password, givenPlayer.password),
			).toBe(true);
		});

		it('should return undefined if no player with the given email exists', async () => {
			// When
			const player = await playerRepository.getByEmail('non-existing-email');

			// Then
			expect(player).toBeUndefined();
		});
	});

	describe('getByEmailAndPassword', () => {
		const givenPlayer = {
			email: 'foo@bar.com',
			password: 'some-secret-password',
			displayName: 'Foo Bar',
		};
		beforeEach(async () => {
			// Given
			await playerRepository.save(givenPlayer);
		});

		it('should return the player with the given email', async () => {
			// When
			const player = await playerRepository.getByEmailAndPassword(
				givenPlayer.email,
				givenPlayer.password,
			);

			// Then
			expect(player).toEqual({
				...givenPlayer,
				password: expect.any(String) as string,
			});
			expect(
				await hashAndVerify.verify(player!.password, givenPlayer.password),
			).toBe(true);
		});

		it('should return undefined if no player with the given email exists', async () => {
			// When
			const player = await playerRepository.getByEmailAndPassword(
				'non-existing-email',
				'whatever',
			);

			// Then
			expect(player).toBeUndefined();
		});

		it('should return undefined if the given password does not match the player password', async () => {
			// When
			const player = await playerRepository.getByEmailAndPassword(
				givenPlayer.email,
				'wrong-password',
			);

			// Then
			expect(player).toBeUndefined();
		});
	});

	describe('isDisplayNameTaken', () => {
		const givenPlayer = {
			email: 'foo@bar.com',
			password: 'some-secret-hash',
			displayName: 'Foo Bar',
		};
		beforeEach(async () => {
			// Given
			await playerRepository.save(givenPlayer);
		});

		it('should return true if a player with the given display name exists', async () => {
			// When
			const isTaken = await playerRepository.isDisplayNameTaken(
				givenPlayer.displayName,
			);

			// Then
			expect(isTaken).toBe(true);
		});

		it('should return false if no player with the given display name exists', async () => {
			// When
			const isTaken = await playerRepository.isDisplayNameTaken(
				'non-existing-display-name',
			);

			// Then
			expect(isTaken).toBe(false);
		});
	});
});
