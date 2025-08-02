import { User } from '../../enterprise/user'
import { makeUser } from '../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../test/repositories/in-memory-users-repository'
import { PermissionVerifier } from '../utils/permission-verifier'
import { ChangeUserStatusUseCase } from './change-user-status'

let usersRepository: InMemoryUsersRepository
let permissionVerifier: PermissionVerifier
let adminUser: User
let sut: ChangeUserStatusUseCase

describe('Auth - Change User Status', () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository()
    permissionVerifier = new PermissionVerifier(usersRepository)
    sut = new ChangeUserStatusUseCase(usersRepository, permissionVerifier)

    adminUser = makeUser()
    usersRepository.items.push(adminUser)
  })

  it('sould be able to change the user status', async () => {
    const user = makeUser({
      status: 'INACTIVE',
    })
    usersRepository.items.push(user)

    const result = await sut.execute({
      changeById: adminUser.id.toString(),
      userId: user.id.toString(),
      newStatus: 'ACTIVE',
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items[1]).toMatchObject({
      status: 'ACTIVE',
    })
  })
})
