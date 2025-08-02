export class UserUnauthorizedError extends Error {
  constructor(id: string) {
    super(`User "${id}" not authorized to perform this action`)
  }
}
