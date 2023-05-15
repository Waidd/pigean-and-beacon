import {Body, Controller, HttpCode, HttpStatus, Post} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {ApiCreatedResponse, ApiTags} from '@nestjs/swagger';
import {PlayerResponse} from '../../player/api/player.response.js';
import {domainToApiError} from '../../commun/api/domain-to-api-error.js';
import configuration from '../../../configuration.js';
import {AuthenticationContainer} from './authentication.container.js';
import {SignInRequest, SignUpRequest} from './authentication.request.js';
import {SignInResponse} from './authentication.response.js';

@ApiTags('authentication')
@Controller('authentication')
export class AuthenticationController {
	public constructor(
		private readonly authenticationContainer: AuthenticationContainer,
		private readonly jwt: JwtService,
	) {}

	@Post('signup')
	@ApiCreatedResponse({
		description: 'The player has been successfully created.',
		type: PlayerResponse,
	})
	public async signup(
		@Body() signUpRequest: SignUpRequest,
	): Promise<PlayerResponse> {
		const playerOrError = await this.authenticationContainer.signUp(
			signUpRequest,
		);
		if (playerOrError instanceof Error) return domainToApiError(playerOrError);
		return {
			email: playerOrError.email,
			displayName: playerOrError.displayName,
		};
	}

	@HttpCode(HttpStatus.OK)
	@Post('signin')
	@ApiCreatedResponse({
		description: 'The player has successfully signed in.',
		type: SignInResponse,
	})
	public async signin(
		@Body() signInRequest: SignInRequest,
	): Promise<SignInResponse> {
		const playerOrError = await this.authenticationContainer.signIn(
			signInRequest,
		);
		if (playerOrError instanceof Error) return domainToApiError(playerOrError);
		return this.signToken(playerOrError.email);
	}

	private async signToken(email: string): Promise<{access_token: string}> {
		const payload = {
			sub: email,
		};
		const token = await this.jwt.signAsync(payload, {
			expiresIn: '15m',
			secret: configuration.JWT_SECRET,
		});
		return {
			access_token: token,
		};
	}
}
