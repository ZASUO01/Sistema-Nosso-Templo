import { Either, left, right } from '@/domain/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { UserUnauthorizedError } from '../errors/user-unauthorized-error'
import { PermissionVerifier } from '../utils/permission-verifier'

interface ChangeUserStatusUseCaseRequest {
  changeById: string
  userId: string
  newStatus: 'ACTIVE' | 'INACTIVE'
}

type ChangeUserStatusUseCaseResponse = Either<
  UserNotFoundError | UserUnauthorizedError,
  null
>

export class ChangeUserStatusUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private permissionVerifier: PermissionVerifier,
  ) {}

  async execute({
    changeById,
    userId,
    newStatus,
  }: ChangeUserStatusUseCaseRequest): Promise<ChangeUserStatusUseCaseResponse> {
    const verificationError = await this.permissionVerifier.verify(changeById)

    if (verificationError) {
      return left(verificationError)
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotFoundError(userId))
    }

    if (user.status !== newStatus) {
      user.status = newStatus
      await this.usersRepository.save(user)
    }

    return right(null)
  }
}
