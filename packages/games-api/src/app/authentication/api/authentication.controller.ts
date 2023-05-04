import {Body, Controller, Post} from '@nestjs/common';
import * as argon from 'argon2';
import {AuthenticationContainer} from './authentication.container.js';
import {SignUpDto} from './authentication.dto.js';

@Controller('auth')
export class AuthenticationController {
	public constructor(
		private readonly authenticationService: AuthenticationContainer,
	) {}

	@Post('signup')
	public async signup(@Body() dto: SignUpDto) {
		const hash = await argon.hash(dto.password);
		return this.authenticationService.signup({
			email: dto.email,
			hash,
			displayName: dto.displayName,
		});
	}

	@Post('signin')
	public signin() {
		return this.authenticationService.signin();
	}
}
