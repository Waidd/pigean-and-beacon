import process from 'node:process';
import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFileSync} from 'node:fs';
import pg from 'pg';
import {
	type MigrationParams,
	Umzug,
	type UmzugStorage,
	type RunnableMigration,
} from 'umzug';
import * as dotenv from 'dotenv';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

class PgStorage implements UmzugStorage<pg.Client> {
	public constructor(public client: pg.Client) {}

	public async logMigration(
		parameters: MigrationParams<pg.Client>,
	): Promise<void> {
		await this.client.query(`insert into meta_migrations_(name) values ($1)`, [
			parameters.name,
		]);
	}

	public async unlogMigration(
		parameters: MigrationParams<pg.Client>,
	): Promise<void> {
		await this.client.query(`delete from meta_migrations_ where name = $1`, [
			parameters.name,
		]);
	}

	public async executed(
		_meta: Pick<MigrationParams<pg.Client>, 'context'>,
	): Promise<string[]> {
		await this.client.query(
			`create table if not exists meta_migrations_(name text)`,
		);
		const response = await this.client.query(
			`select name from meta_migrations_`,
		);
		return response.rows.map((r: {name: string}) => r.name);
	}
}

const client = new pg.Client(process.env.DATABASE_URL);
await client.connect();
const pgStorage = new PgStorage(client);

export const migrator = new Umzug({
	migrations: {
		glob: ['migrations/*.ts', {cwd: __dirname}],
		resolve(parameters) {
			const getModule = async () =>
				import(`file:///${parameters.path!.replace(/\\/g, '/')}`) as Promise<
					RunnableMigration<pg.Client>
				>;
			return {
				name: parameters.name,
				path: parameters.path!,
				async up(upParameters) {
					const migration = await getModule();
					await migration.up(upParameters);
				},
				async down(downParameters) {
					const migration = await getModule();
					await migration.down?.(downParameters);
				},
			};
		},
	},
	context: client,
	storage: pgStorage,
	logger: console,
	create: {
		folder: 'src/db/migrations',
		template: (filepath) => [
			[
				filepath,
				readFileSync(resolve(__dirname, 'migration-template.ts')).toString(),
			],
		],
	},
});

try {
	await migrator.runAsCLI();
} finally {
	await client.end();
}
