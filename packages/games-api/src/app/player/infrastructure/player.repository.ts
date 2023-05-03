import {
	StubbedPoolWrapper,
	type SqlPoolWrapper,
	type SqlClientTrackedOutput,
} from '../../../libs/pool-wrapper.js';
import type OutputTracker from '../../../libs/output-tracker.js';
import ConfigurableResponses from '../../../libs/configurable-responses.js';
import {getClient} from '../../../database.js';
import {type Player} from '../domain/player.entity.js';

export type PlayerSql = {
	id: number;
	email: string;
	hash: string;
	display_name: string;
};

export class PlayerRepository {
	public static create(): PlayerRepository {
		return new PlayerRepository(getClient());
	}

	public static createNull(
		players: ConfigurableResponses<PlayerSql> = ConfigurableResponses.createSingle<PlayerSql>(
			{
				id: 1,
				email: 'foo@bar.com',
				hash: 'some-secret-hash',
				display_name: 'Foo Bar',
			},
			'PlayerRepository',
		),
		outputTracker?: OutputTracker<SqlClientTrackedOutput>,
	): PlayerRepository {
		return new PlayerRepository(new StubbedPoolWrapper(players, outputTracker));
	}

	public constructor(private readonly sql: SqlPoolWrapper) {}

	public async save(player: Player): Promise<Player> {
		const result = await this.sql.query<PlayerSql>(
			`
				INSERT INTO player_ (email, hash, display_name)
				VALUES ($1, $2, $3)
				RETURNING *;
			`,
			[player.email, player.hash, player.displayName],
		);

		return {
			email: result.rows[0].email,
			hash: result.rows[0].hash,
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
		);

		if (result.rows.length === 0) return undefined;

		return {
			email: result.rows[0].email,
			hash: result.rows[0].hash,
			displayName: result.rows[0].display_name,
		};
	}
}
