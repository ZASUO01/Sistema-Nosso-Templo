import { Either, left, right } from '@/domain/core/either'
import { User } from '../../enterprise/user'
import { UsersRepository } from '../repositories/users-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { UserUnauthorizedError } from '../errors/user-unauthorized-error'
import { PermissionVerifier } from '../utils/permission-verifier'

interface UpdateUserUseCaseRequest {
  changeById: string
  userId: string
  firstName: string
  lastName: string
  nick?: string
  phone?: string
}

type UpdateUserUseCaseResponse = Either<
  UserNotFoundError | UserUnauthorizedError,
  { user: User }
>

export class UpdateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private permissionVerifier: PermissionVerifier,
  ) {}

  async execute({
    changeById,
    userId,
    firstName,
    lastName,
    nick,
    phone,
  }: UpdateUserUseCaseRequest): Promise<UpdateUserUseCaseResponse> {
    const verificationError = await this.permissionVerifier.verify(changeById)

    if (verificationError) {
      return left(verificationError)
    }

    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotFoundError(userId))
    }

    user.firstName = firstName
    user.lastName = lastName
    user.nick = nick
    user.phone = phone
    user.updatedAt = new Date()

    await this.usersRepository.save(user)

    return right({ user })
  }
}
