import {Controller, Get} from '@nestjs/common';
import {ApiOkResponse, ApiTags} from '@nestjs/swagger';
import {healthcheck} from '../../../database.js';

@ApiTags('00 - probes')
@Controller('probes')
export class ProbesController {
	@Get('version')
	@ApiOkResponse({type: String})
	public async getVersion() {
		return '0.0.0';
	}

	@Get('readiness')
	@ApiOkResponse({type: String})
	public async checkReadiness() {
		await healthcheck();
		return 'ok';
	}
}
