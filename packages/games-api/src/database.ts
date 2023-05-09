import pg from 'pg';
import {PgPoolWrapper} from './libs/sql-pool-wrapper.js';
import configuration from './configuration.js';

let poolWrapper: PgPoolWrapper | undefined;
export function getClient(): PgPoolWrapper {
	if (poolWrapper) return poolWrapper;

	const pool = new pg.Pool({
		connectionString: configuration.isTest
			? configuration.DATABASE_TEST_URL
			: configuration.DATABASE_URL,
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
