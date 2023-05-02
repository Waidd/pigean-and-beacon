import {dirname, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {readFileSync} from 'node:fs';
import {type Client} from 'pg';
import {
	type MigrationParams,
	Umzug,
	type UmzugStorage,
	type RunnableMigration,
} from 'umzug';
import * as dotenv from 'dotenv';
import {getClient, closeClient} from '../src/database.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

class PgStorage implements UmzugStorage<Client> {
	public constructor(public client: Client) {}

	public async logMigration(
		parameters: MigrationParams<Client>,
	): Promise<void> {
		await this.client.query(`insert into meta_migrations_(name) values ($1)`, [
			parameters.name,
		]);
	}

	public async unlogMigration(
		parameters: MigrationParams<Client>,
	): Promise<void> {
		await this.client.query(`delete from meta_migrations_ where name = $1`, [
			parameters.name,
		]);
	}

	public async executed(
		_meta: Pick<MigrationParams<Client>, 'context'>,
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

const client = await getClient();
const pgStorage = new PgStorage(client);

export const migrator = new Umzug({
	migrations: {
		glob: ['migrations/*.ts', {cwd: __dirname}],
		resolve(parameters) {
			const getModule = async () =>
				import(`file:///${parameters.path!.replace(/\\/g, '/')}`) as Promise<
					RunnableMigration<Client>
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

await migrator.runAsCLI();
await closeClient();
