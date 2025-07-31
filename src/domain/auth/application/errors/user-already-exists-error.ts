export class UserAlreadyExistsError extends Error {
  constructor(id: string) {
    super(`User "${id}" already exists`)
  }
}
