import { z, ZodSchema } from 'zod'
import { Context } from 'hono'


export function validateSchema(schema: ZodSchema<any>) {
  return async (c: Context, next: () => Promise<void>) => {
    try {
      const body = await c.req.json()
      schema.parse(body)
        // Put validated body back on context for handlers
        // Hono doesn't have a built-in ctx.state, so we attach to req as __validated
        ; (c.req as any).__validated = body
      await next()
    } catch (err: any) {
      return c.json({ error: err.errors ? err.errors : err.message }, 400)
    }
  }
}