import { FastifyReply, FastifyRequest } from 'fastify'

export async function register(req: FastifyRequest, res: FastifyReply) {
  /*
  const registerBodySchema = z.object({
    first_name: z.string(),
    last_name: z.string(),
    nick: z.string().optional(),
    email: z.email(),
    password: z.string().min(6),
  })

  
  const { first_name, last_name, nick, email, password } =
    registerBodySchema.parse(req.body)

  try {
  } catch {}
  */

  return res.status(201).send()
}
