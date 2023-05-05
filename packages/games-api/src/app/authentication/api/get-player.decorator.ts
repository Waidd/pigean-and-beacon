import {type ExecutionContext, createParamDecorator} from '@nestjs/common';
import {type Request} from 'express';
import {type Player} from '../../player/domain/player.entity.js';

// eslint-disable-next-line @typescript-eslint/naming-convention
export const GetPlayer = createParamDecorator(
	<T extends keyof Player>(
		field: T | undefined,
		ctx: ExecutionContext,
	): Player | Player[T] => {
		const request: Request = ctx.switchToHttp().getRequest();
		const player = request.user as Player;
		if (field) return player[field];
		return player;
	},
);
