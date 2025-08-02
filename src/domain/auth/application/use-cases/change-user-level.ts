import { Either, left, right } from '@/domain/core/either'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { UserUnauthorizedError } from '../errors/user-unauthorized-error'
import { UsersRepository } from '../repositories/users-repository'
import { PermissionVerifier } from '../utils/permission-verifier'

interface ChangeUserLevelUseCaseRequest {
  changeById: string
  userId: string
  newLevel: 'ADMIN' | 'DEFAULT'
}

type ChangeUserLevelUseCaseResponse = Either<
  UserNotFoundError | UserUnauthorizedError,
  null
>

export class ChangeUserLevelUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private permissionVerifier: PermissionVerifier,
  ) {}

  async execute({
    changeById,
    userId,
    newLevel,
  }: ChangeUserLevelUseCaseRequest): Promise<ChangeUserLevelUseCaseResponse> {
    const verificationError = await this.permissionVerifier.verify(changeById)

    if (verificationError) {
      return left(verificationError)
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotFoundError(userId))
    }

    if (user.level !== newLevel) {
      user.level = newLevel
      await this.usersRepository.save(user)
    }

    return right(null)
  }
}
