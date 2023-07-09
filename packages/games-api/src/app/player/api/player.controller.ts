import {Controller, Get, UseGuards} from '@nestjs/common';
import {AuthGuard} from '@nestjs/passport';
import {ApiBearerAuth, ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {GetPlayer} from '../../authentication/api/get-player.decorator.js';
import {Player} from '../domain/player.entity.js';
import {PlayerContainer} from './player.container.js';
import {PlayerResponse} from './player.response.js';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@ApiTags('02 - player')
@Controller('player')
export class PlayerController {
	public constructor(private readonly playerContainer: PlayerContainer) {}

	@Get('me')
	@ApiOkResponse({
		description: 'The current player.',
		type: PlayerResponse,
	})
	public async getMe(@GetPlayer() player: Player) {
		return {
			email: player.email,
			displayName: player.displayName,
		};
	}
}
