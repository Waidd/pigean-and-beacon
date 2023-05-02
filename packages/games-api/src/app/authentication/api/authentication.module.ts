import {Module} from '@nestjs/common';
import {AuthenticationController} from './authentication.controller.js';
import {AuthenticationContainer} from './authentication.container.js';

@Module({
	controllers: [AuthenticationController],
	providers: [AuthenticationContainer],
})
export class AuthenticationModule {}
