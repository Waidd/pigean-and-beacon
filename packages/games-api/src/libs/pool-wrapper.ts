import {EventEmitter} from 'node:events';
import {type Pool} from 'pg';
import type ConfigurableResponses from './configurable-responses';
import type OutputTracker from './output-tracker';

export type SqlClientResponse<R> = {
	command: string;
	rowCount: number;
	rows: R[];
};

export type SqlQueryFn = <
	R extends Record<string, any> = any,
	I extends any[] = any[],
>(
	query: string,
	values?: I,
	label?: string,
) => Promise<SqlClientResponse<R>>;

export type SqlPoolWrapper = {
	query: SqlQueryFn;
	transaction: <T>(fn: (query: SqlQueryFn) => Promise<T>) => Promise<T>;
};

export class PgPoolWrapper implements SqlPoolWrapper {
	public constructor(private readonly _pool: Pool) {}

	public async query<
		R extends Record<string, any> = any,
		I extends any[] = any[],
	>(query: string, values?: I): Promise<SqlClientResponse<R>> {
		return this._pool.query(query, values);
	}

	public async transaction<T>(
		fn: (query: SqlQueryFn) => Promise<T>,
	): Promise<T> {
		const connection = await this._pool.connect();
		try {
			await connection.query('BEGIN');
			const result = await fn(connection.query.bind(connection));
			await connection.query('COMMIT');
			connection.release();
			return result;
		} catch (error) {
			await connection.query('ROLLBACK');
			connection.release();
			throw error;
		}
	}

	public async end(): Promise<void> {
		await this._pool.end();
	}
}

export type SqlClientTrackedOutput = {
	label: string;
	query: string;
	values: any[];
};

const queryEvent = 'query';

export class StubbedPoolWrapper<T> implements SqlPoolWrapper {
	private readonly _emitter: EventEmitter | undefined;

	public constructor(
		private readonly _responses: ConfigurableResponses<T>,
		outputTracker?: OutputTracker<SqlClientTrackedOutput>,
	) {
		if (outputTracker) {
			this._emitter = new EventEmitter();
			outputTracker.register(this._emitter, queryEvent);
		}
	}

	public async query<
		R extends Record<string, any> = any,
		I extends any[] = any[],
	>(query: string, values?: I, label?: string): Promise<SqlClientResponse<R>> {
		this._emitter?.emit(queryEvent, {label, query, values});
		const rows = this._responses.next(label);
		if (!rows) {
			return {
				command: query,
				rowCount: 0,
				rows: [],
			};
		}

		return {
			command: query,
			rowCount: 1,
			rows: (Array.isArray(rows) ? rows : [rows]) as R[],
		};
	}

	public async transaction<T>(
		fn: (query: SqlQueryFn) => Promise<T>,
	): Promise<T> {
		return fn(this.query.bind(this));
	}
}
