import { cache } from "react"
import { cookies, headers } from "next/headers"
import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"

const t = initTRPC.create({
  transformer: superjson,
})

export const createTRPCRouter = t.router
// export const createCallerFactory = t.createCallerFactory
export const publicProcedure = t.procedure
