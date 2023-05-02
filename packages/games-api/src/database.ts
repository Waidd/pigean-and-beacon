import process from 'node:process';
import pg from 'pg';

export type SqlClientTrackedOutput = {query: string; values: any[]};

export type SqlClientResponse<R> = {
	command: string;
	rowCount: number;
	rows: R[];
};
export type SqlClient = {
	query<R extends Record<string, any> = any, I extends any[] = any[]>(
		query: string,
		values?: I,
	): Promise<SqlClientResponse<R>>;
};

export type SqlClientProvider = () => Promise<SqlClient>;

let clientInstance: pg.Client | undefined;
export async function getClient(): Promise<pg.Client> {
	if (clientInstance) return clientInstance;

	const client = new pg.Client(process.env.DATABASE_URL);
	await client.connect();
	clientInstance = client;

	return client;
}

export async function closeClient(): Promise<void> {
	if (!clientInstance) return;

	await clientInstance.end();
	clientInstance = undefined;
}
