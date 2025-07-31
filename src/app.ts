import fastify from 'fastify'
import { usersRoutes } from './http/controllers/auth/routes'

export const app = fastify()

app.register(usersRoutes, { prefix: '/v1/users' })
