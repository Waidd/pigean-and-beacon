import {NotFoundError} from '../../commun/domain/domain.error.js';
import {PlayerRepository} from '../infrastructure/player.repository.js';
import {type Player} from './player.entity.js';

export type GetPlayer = (
	playerEmail: string,
) => Promise<Player | PlayerNotFoundError>;

export class PlayerNotFoundError extends NotFoundError {
	private readonly __nominal!: void;
	constructor(email: string) {
		const message = `No player found with email: ${email}`;
		super(message);
		this.name = this.constructor.name;
	}
}

export class GetPlayerUsecase {
	public static create(): GetPlayer {
		const usecase = new GetPlayerUsecase(PlayerRepository.create());
		return usecase.execute.bind(usecase);
	}

	public static createNull(
		stubbedPlayerRepository = PlayerRepository.createNull(),
	): GetPlayer {
		const usecase = new GetPlayerUsecase(stubbedPlayerRepository);
		return usecase.execute.bind(usecase);
	}

	public constructor(private readonly playerRepository: PlayerRepository) {}

	public async execute(email: string): Promise<Player | PlayerNotFoundError> {
		const player = await this.playerRepository.getByEmail(email);
		if (!player) return new PlayerNotFoundError(email);
		return player;
	}
}
