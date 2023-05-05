import {
	ArgonHashAndVerify,
	type HashAndVerify,
	StubbedHashAndVerify,
} from '../../../libs/hash-and-verify-wrapper.js';
import {
	StubbedPoolWrapper,
	type SqlPoolWrapper,
	type SqlClientTrackedOutput,
} from '../../../libs/sql-pool-wrapper.js';
import type OutputTracker from '../../../libs/output-tracker.js';
import ConfigurableResponses from '../../../libs/configurable-responses.js';
import {getClient} from '../../../database.js';
import {type Player} from '../domain/player.entity.js';

export type PlayerSql = {
	id: number;
	email: string;
	password: string;
	display_name: string;
};

export class PlayerRepository {
	public static create(): PlayerRepository {
		return new PlayerRepository(getClient(), new ArgonHashAndVerify());
	}

	public static createNull(
		players: ConfigurableResponses<
			PlayerSql | PlayerSql[]
		> = new ConfigurableResponses<PlayerSql>([
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
		]),
		outputTracker?: OutputTracker<SqlClientTrackedOutput>,
	): PlayerRepository {
		return new PlayerRepository(
			new StubbedPoolWrapper(players, outputTracker),
			new StubbedHashAndVerify(),
		);
	}

	public constructor(
		private readonly sql: SqlPoolWrapper,
		private readonly hashAndVerify: HashAndVerify,
	) {}

	public async save(player: Player): Promise<Player> {
		const hash = await this.hashAndVerify.hash(player.password);

		const result = await this.sql.query<PlayerSql>(
			`
				INSERT INTO player_ (email, password, display_name)
				VALUES ($1, $2, $3)
				RETURNING *;
			`,
			[player.email, hash, player.displayName],
			'player',
		);

		return {
			email: result.rows[0].email,
			password: result.rows[0].password,
			displayName: result.rows[0].display_name,
		};
	}

	public async getByEmail(email: string): Promise<Player | undefined> {
		const result = await this.sql.query<PlayerSql>(
			`
				SELECT *
				FROM player_
				WHERE email = $1;
			`,
			[email],
			'player',
		);

		if (result.rows.length === 0) return undefined;

		return {
			email: result.rows[0].email,
			password: result.rows[0].password,
			displayName: result.rows[0].display_name,
		};
	}

	public async getByEmailAndPassword(
		email: string,
		password: string,
	): Promise<Player | undefined> {
		const player = await this.getByEmail(email);
		if (!player) return undefined;

		const isPasswordValid = await this.hashAndVerify.verify(
			player.password,
			password,
		);
		if (!isPasswordValid) {
			return undefined;
		}

		return player;
	}

	public async isEmailTaken(email: string): Promise<boolean> {
		const result = await this.sql.query<PlayerSql>(
			`
				SELECT *
				FROM player_
				WHERE email = $1;
			`,
			[email],
		);

		return result.rows.length > 0;
	}

	public async isDisplayNameTaken(displayName: string): Promise<boolean> {
		const result = await this.sql.query<PlayerSql>(
			`
				SELECT *
				FROM player_
				WHERE display_name = $1;
			`,
			[displayName],
		);

		return result.rows.length > 0;
	}
}
