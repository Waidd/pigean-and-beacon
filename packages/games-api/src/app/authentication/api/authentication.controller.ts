import process from 'node:process';
import {Body, Controller, Post} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {domainToApiError} from '../../commun/api/domain-to-api-error.js';
import {AuthenticationContainer} from './authentication.container.js';
import {SignInDto, SignUpDto} from './authentication.dto.js';

@Controller('authentication')
export class AuthenticationController {
	public constructor(
		private readonly authenticationContainer: AuthenticationContainer,
		private readonly jwt: JwtService,
	) {}

	@Post('signup')
	public async signup(@Body() dto: SignUpDto) {
		const playerOrError = await this.authenticationContainer.signUp(dto);
		if (playerOrError instanceof Error) return domainToApiError(playerOrError);
		return {
			email: playerOrError.email,
			displayName: playerOrError.displayName,
		};
	}

	@Post('signin')
	public async signin(@Body() dto: SignInDto) {
		const playerOrError = await this.authenticationContainer.signIn(dto);
		if (playerOrError instanceof Error) return domainToApiError(playerOrError);
		return this.signToken(playerOrError.email);
	}

	private async signToken(email: string): Promise<{access_token: string}> {
		const payload = {
			sub: email,
		};
		const token = await this.jwt.signAsync(payload, {
			expiresIn: '15m',
			secret: process.env.JWT_SECRET!, // TODO improve that
		});
		return {
			access_token: token,
		};
	}
}
