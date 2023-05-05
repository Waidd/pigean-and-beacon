import {Controller, Get, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {GetPlayer} from '../../authentication/api/get-player.decorator.js';
import {Player} from '../domain/player.entity.js';
import {PlayerContainer} from './player.container.js';

@UseGuards(AuthGuard('jwt'))
@Controller('player')
export class PlayerController {
	public constructor(private readonly playerContainer: PlayerContainer) {}

	@Get('me')
	public async getMe(@GetPlayer() player: Player) {
		return {
			email: player.email,
			displayName: player.displayName,
		};
	}
}
