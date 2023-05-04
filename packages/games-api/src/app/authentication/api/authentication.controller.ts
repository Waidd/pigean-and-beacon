import {Body, Controller, Post} from '@nestjs/common';
import * as argon from 'argon2';
import {domainToApiError} from '../../commun/api/domain-to-api-error.js';
import {AuthenticationContainer} from './authentication.container.js';
import {SignUpDto} from './authentication.dto.js';

@Controller('authentication')
export class AuthenticationController {
	public constructor(
		private readonly authenticationService: AuthenticationContainer,
	) {}

	@Post('signup')
	public async signup(@Body() dto: SignUpDto) {
		const hash = await argon.hash(dto.password);
		const playerOrError = await this.authenticationService.signup({
			email: dto.email,
			hash,
			displayName: dto.displayName,
		});
		if (playerOrError instanceof Error) return domainToApiError(playerOrError);
		return {
			email: playerOrError.email,
			displayName: playerOrError.displayName,
		};
	}

	@Post('signin')
	public signin() {
		return this.authenticationService.signin();
	}
}
