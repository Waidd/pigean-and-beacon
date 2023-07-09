import {type MiddlewareConsumer, Module} from '@nestjs/common';
import {AuthenticationModule} from './app/authentication/api/authentication.module.js';
import {PlayerModule} from './app/player/api/player.module.js';
import {closeClient} from './database.js';
import {ProbesModule} from './app/probes/api/probes.module.js';
import {HttpLoggerMiddleware} from './app/commun/api/http-logger-middleware.js';

@Module({
	imports: [AuthenticationModule, PlayerModule, ProbesModule],
})
export class AppModule {
	public configure(consumer: MiddlewareConsumer): void {
		consumer.apply(HttpLoggerMiddleware).forRoutes('*');
	}

	public async onApplicationShutDown(): Promise<void> {
		await closeClient();
	}
}
