import pg from 'pg';
import {PgPoolWrapper} from './libs/sql-pool-wrapper.js';
import {getDatabaseUrl, isInNullMode} from './configuration.js';

let poolWrapper: PgPoolWrapper | undefined;
export function getClient(): PgPoolWrapper {
	if (isInNullMode()) throw new Error('Should not use database in null mode');

	if (poolWrapper) return poolWrapper;

	const pool = new pg.Pool({
		connectionString: getDatabaseUrl(),
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
