import {Body, Controller, Post} from '@nestjs/common';
import * as argon from 'argon2';
import {AuthenticationContainer} from './authentication.container.js';
import {AuthenticationDto} from './authentication.dto.js';

@Controller('auth')
export class AuthenticationController {
	public constructor(
		private readonly authenticationService: AuthenticationContainer,
	) {}

	@Post('signup')
	public async signup(@Body() dto: AuthenticationDto) {
		const hash = await argon.hash(dto.password);

		console.log(dto);
		return this.authenticationService.signup();
	}

	@Post('signin')
	public signin() {
		return this.authenticationService.signin();
	}
}
