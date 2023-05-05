import {Injectable} from '@nestjs/common';
import {GetPlayerUsecase} from '../domain/get-player.usecase.js';

@Injectable({})
export class PlayerContainer {
	public getPlayer = GetPlayerUsecase.create();
}
