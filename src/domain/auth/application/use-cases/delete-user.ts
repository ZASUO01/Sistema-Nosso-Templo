import { Either, left, right } from '@/domain/core/either'
import { UsersRepository } from '../repositories/users-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { UserUnauthorizedError } from '../errors/user-unauthorized-error'
import { PermissionVerifier } from '../utils/permission-verifier'

interface DeleteUserUseCaseRequest {
  changeById: string
  userId: string
}

type DeleteUserUseCaseResponse = Either<
  UserNotFoundError | UserUnauthorizedError,
  null
>

export class DeleteUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private permissionVerifier: PermissionVerifier,
  ) {}

  async execute({
    changeById,
    userId,
  }: DeleteUserUseCaseRequest): Promise<DeleteUserUseCaseResponse> {
    const verificationError = await this.permissionVerifier.verify(changeById)

    if (verificationError) {
      return left(verificationError)
    }

    const foundUser = await this.usersRepository.findById(userId)

    if (!foundUser) {
      return left(new UserNotFoundError(userId))
    }

    await this.usersRepository.deleteById(userId)

    return right(null)
  }
}
