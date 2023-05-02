import {PlayerRepository} from '../../player/infrastructure/player.repository.js';
import {type Player} from '../../player/domain/player.entity.js';

export type SignUpCommand = Player;

export type SignUp = (command: SignUpCommand) => Promise<Player>;

export class SignUpUsecase {
	public static create(): SignUp {
		const usecase = new SignUpUsecase(PlayerRepository.create());
		return usecase.execute.bind(usecase);
	}

	public static createNull(
		stubbedPlayerRepository = PlayerRepository.createNull(),
	): SignUp {
		const usecase = new SignUpUsecase(stubbedPlayerRepository);
		return usecase.execute.bind(usecase);
	}

	public constructor(private readonly playerRepository: PlayerRepository) {}

	public async execute(command: SignUpCommand): Promise<Player> {
		return this.playerRepository.save(command);
	}
}
