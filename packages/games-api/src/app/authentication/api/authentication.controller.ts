import {Body, Controller, Post} from '@nestjs/common';
import {AuthenticationContainer} from './authentication.container.js';
import {AuthenticationDto} from './authentication.dto.js';

@Controller('auth')
export class AuthenticationController {
	public constructor(
		private readonly authenticationService: AuthenticationContainer,
	) {}

	@Post('signup')
	public signup(@Body() dto: AuthenticationDto) {
		console.log(dto);
		return this.authenticationService.signup();
	}

	@Post('signin')
	public signin() {
		return this.authenticationService.signin();
	}
}
