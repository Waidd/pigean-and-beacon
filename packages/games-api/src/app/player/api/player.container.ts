import {Injectable} from '@nestjs/common';
import {GetPlayerUsecase} from '../domain/get-player.usecase.js';
import {isInNullMode} from '../../../configuration.js';

@Injectable({})
export class PlayerContainer {
	public getPlayer = isInNullMode()
		? GetPlayerUsecase.createNull()
		: GetPlayerUsecase.create();
}
