import {Module} from '@nestjs/common';
import {JwtModule} from '@nestjs/jwt';
import {PlayerContainer} from '../../player/api/player.container.js';
import {AuthenticationController} from './authentication.controller.js';
import {AuthenticationContainer} from './authentication.container.js';
import {JwtStrategy} from './jwt.strategy.js';

@Module({
	imports: [JwtModule.register({})],
	controllers: [AuthenticationController],
	providers: [AuthenticationContainer, JwtStrategy, PlayerContainer],
})
export class AuthenticationModule {}
