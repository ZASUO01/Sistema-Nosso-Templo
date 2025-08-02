import { UsersRepository } from '../../application/repositories/users-repository'
import { User } from '../../enterprise/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findByEmail(email: string) {
    const user = this.items.find((item) => item.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async findById(id: string) {
    const user = this.items.find((item) => item.id.toString() === id)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User) {
    this.items.push(user)
  }

  async save(user: User) {
    const idx = this.items.findIndex((item) => item.id.equals(user.id))

    this.items[idx] = user
  }

  async deleteById(id: string) {
    const idx = this.items.findIndex((item) => item.id.toString() === id)

    this.items.splice(idx, 1)
  }
}
