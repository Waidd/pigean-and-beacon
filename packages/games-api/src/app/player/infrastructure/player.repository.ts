import EventEmitter from 'node:events';
import type OutputTracker from '../../../libs/output-tracker.js';
import type ConfigurableResponses from '../../../libs/configurable-responses.js';
import {
	type SqlClientProvider,
	getClient,
	type SqlClient,
} from '../../../database.js';
import {type Player} from '../domain/player.entity.js';

export type PlayerSql = {
	id: number;
	email: string;
	hash: string;
	display_name: string;
};

export class PlayerRepository {
	public static create(): PlayerRepository {
		return new PlayerRepository(getClient);
	}

	public static createNull(
		players: ConfigurableResponses<PlayerSql>,
		outputTracker?: OutputTracker<{query: string; values: any[]}>,
	): PlayerRepository {
		return new PlayerRepository(
			async () => new StubbedPlayerSqlClient(players, outputTracker),
		);
	}

	public constructor(private readonly clientSqlProvider: SqlClientProvider) {}

	public async save(player: Player): Promise<Player> {
		const client = await this.clientSqlProvider();

		const result = await client.query<PlayerSql>(
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
		const client = await this.clientSqlProvider();

		const result = await client.query<PlayerSql>(
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

const queryEvent = 'PLAYER_QUERY';

export class StubbedPlayerSqlClient implements SqlClient {
	private readonly _emitter: EventEmitter | undefined;

	public constructor(
		private readonly _players: ConfigurableResponses<PlayerSql>,
		outputTracker?: OutputTracker<{query: string; values: any[]}>,
	) {
		if (outputTracker) {
			this._emitter = new EventEmitter();
			outputTracker.register(this._emitter, queryEvent);
		}
	}

	public async query<
		R extends Record<string, any> = any,
		I extends any[] = any[],
	>(
		query: string,
		values?: I,
	): Promise<{
		command: string;
		rowCount: number;
		rows: R[];
	}> {
		const rows = this._players.next();
		this._emitter?.emit(queryEvent, {query, values});
		return {
			command: query,
			rowCount: 1,
			rows: rows as unknown as R[], // @TODO improve that ?
		};
	}
}
