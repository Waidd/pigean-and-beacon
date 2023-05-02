import {Module} from '@nestjs/common';
import {AuthenticationModule} from './app/authentication/api/authentication.module.js';
import {PlayerModule} from './app/player/api/player.module.js';

@Module({
	imports: [AuthenticationModule, PlayerModule],
})
export class AppModule {}
