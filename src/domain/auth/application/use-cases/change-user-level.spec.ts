import { User } from '../../enterprise/user'
import { makeUser } from '../../test/factories/make-user'
import { InMemoryUsersRepository } from '../../test/repositories/in-memory-users-repository'
import { PermissionVerifier } from '../utils/permission-verifier'
import { ChangeUserLevelUseCase } from './change-user-level'

let usersRepository: InMemoryUsersRepository
let permissionVerifier: PermissionVerifier
let adminUser: User
let sut: ChangeUserLevelUseCase

describe('Auth - Change User Status', () => {
  beforeAll(() => {
    usersRepository = new InMemoryUsersRepository()
    permissionVerifier = new PermissionVerifier(usersRepository)
    sut = new ChangeUserLevelUseCase(usersRepository, permissionVerifier)

    adminUser = makeUser()
    usersRepository.items.push(adminUser)
  })

  it('sould be able to change the user level', async () => {
    const user = makeUser({
      level: 'DEFAULT',
    })
    usersRepository.items.push(user)

    const result = await sut.execute({
      changeById: adminUser.id.toString(),
      userId: user.id.toString(),
      newLevel: 'ADMIN',
    })

    expect(result.isRight()).toBe(true)
    expect(usersRepository.items[1]).toMatchObject({
      level: 'ADMIN',
    })
  })
})
