import { UserNotFoundError } from '../errors/user-not-found-error'
import { UserUnauthorizedError } from '../errors/user-unauthorized-error'
import { UsersRepository } from '../repositories/users-repository'

type VerificationResponse = null | UserNotFoundError | UserUnauthorizedError

export class PermissionVerifier {
  constructor(private usersRepository: UsersRepository) {}

  async verify(id: string): Promise<VerificationResponse> {
    const modifierUser = await this.usersRepository.findById(id)

    if (!modifierUser) {
      return new UserNotFoundError(id)
    }

    const isAdmin = modifierUser.level === 'ADMIN'

    if (!isAdmin) {
      return new UserUnauthorizedError(id)
    }

    return null
  }
}
