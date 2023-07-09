import {Module} from '@nestjs/common';
import {ProbesController} from './probes.controller.js';

@Module({
	controllers: [ProbesController],
	providers: [],
})
export class ProbesModule {}
