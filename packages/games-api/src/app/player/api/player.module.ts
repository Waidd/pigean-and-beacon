import {Module} from '@nestjs/common';
import {PlayerController} from './player.controller.js';
import {PlayerContainer} from './player.container.js';

@Module({
	controllers: [PlayerController],
	providers: [PlayerContainer],
})
export class PlayerModule {}
