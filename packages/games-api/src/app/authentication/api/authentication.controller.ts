import {Body, Controller, Post} from '@nestjs/common';
import {domainToApiError} from '../../commun/api/domain-to-api-error.js';
import {AuthenticationContainer} from './authentication.container.js';
import {SignInDto, SignUpDto} from './authentication.dto.js';

@Controller('authentication')
export class AuthenticationController {
	public constructor(
		private readonly authenticationService: AuthenticationContainer,
	) {}

	@Post('signup')
	public async signup(@Body() dto: SignUpDto) {
		const playerOrError = await this.authenticationService.signUp(dto);
		if (playerOrError instanceof Error) return domainToApiError(playerOrError);
		return {
			email: playerOrError.email,
			displayName: playerOrError.displayName,
		};
	}

	@Post('signin')
	public async signin(@Body() dto: SignInDto) {
		const playerOrError = await this.authenticationService.signIn(dto);
		if (playerOrError instanceof Error) return domainToApiError(playerOrError);
		return {
			email: playerOrError.email,
			displayName: playerOrError.displayName,
		};
	}
}
