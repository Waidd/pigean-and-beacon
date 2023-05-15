import {PassportStrategy} from '@nestjs/passport';
import {ExtractJwt, Strategy} from 'passport-jwt';
import {Injectable} from '@nestjs/common';
import {PlayerContainer} from '../../player/api/player.container.js';
import {domainToApiError} from '../../commun/api/domain-to-api-error.js';
import {configuration} from '../../../configuration.js';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
	public constructor(private readonly playerContainer: PlayerContainer) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configuration.JWT_SECRET,
		});
	}

	public validate(payload: {sub: string}): any {
		const playerOrError = this.playerContainer.getPlayer(payload.sub);
		if (playerOrError instanceof Error) return domainToApiError(playerOrError);
		return playerOrError;
	}
}
