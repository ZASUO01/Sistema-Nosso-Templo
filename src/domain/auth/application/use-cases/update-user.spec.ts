import { User } from '../../enterprise/user'
import { makeUser } from '../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../test/repositories/in-memory-users-repository'
import { UserNotFoundError } from '../errors/user-not-found-error'
import { PermissionVerifier } from '../utils/permission-verifier'
import { UpdateUserUseCase } from './update-user'

let usersRepository: InMemoryUsersRepository
let permissionVerifier: PermissionVerifier
let adminUser: User
let sut: UpdateUserUseCase

describe('Auth - Update User', () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository()
    permissionVerifier = new PermissionVerifier(usersRepository)
    sut = new UpdateUserUseCase(usersRepository, permissionVerifier)

    adminUser = makeUser()
    usersRepository.items.push(adminUser)
  })

  it('sould be able to update an user', async () => {
    const user = makeUser()
    usersRepository.items.push(user)

    const result = await sut.execute({
      changeById: adminUser.id.toString(),
      userId: user.id.toString(),
      firstName: 'updated-fname',
      lastName: 'updated-lname',
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items[1]).toMatchObject({
      firstName: 'updated-fname',
      lastName: 'updated-lname',
    })
  })

  it('should not be able to update invalid user', async () => {
    const result = await sut.execute({
      changeById: adminUser.id.toString(),
      userId: 'ivalid-user',
      firstName: '',
      lastName: '',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotFoundError)
  })
})
