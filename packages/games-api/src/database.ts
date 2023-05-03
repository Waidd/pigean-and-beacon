import process from 'node:process';
import pg from 'pg';
import {PgPoolWrapper} from './libs/pool-wrapper.js';

let poolWrapper: PgPoolWrapper | undefined;
export function getClient(): PgPoolWrapper {
	if (poolWrapper) return poolWrapper;

	const pool = new pg.Pool({
		connectionString: process.env.DATABASE_URL,
	});
	const poolWrapperInstance = new PgPoolWrapper(pool);
	poolWrapper = poolWrapperInstance;
	return poolWrapperInstance;
}

export async function closeClient(): Promise<void> {
	if (!poolWrapper) return;

	await poolWrapper.end();
	poolWrapper = undefined;
}
