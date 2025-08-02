import { User } from '../../enterprise/user'
import { makeUser } from '../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../test/repositories/in-memory-users-repository'
import { PermissionVerifier } from '../utils/permission-verifier'
import { DeleteUserUseCase } from './delete-user'
import { UserNotFoundError } from '../errors/user-not-found-error'

let usersRepository: InMemoryUsersRepository
let permissionVerifier: PermissionVerifier
let sut: DeleteUserUseCase
let adminUser: User

describe('Auth - Delete User', () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository()
    permissionVerifier = new PermissionVerifier(usersRepository)
    sut = new DeleteUserUseCase(usersRepository, permissionVerifier)

    adminUser = makeUser()
    usersRepository.items.push(adminUser)
  })

  it('should be able to delete an user', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    const result = await sut.execute({
      changeById: adminUser.id.toString(),
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items).toHaveLength(1)
  })

  it('should not be able to delete an invalid user', async () => {
    const result = await sut.execute({
      changeById: adminUser.id.toString(),
      userId: 'invalid-user',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotFoundError)
  })
})
