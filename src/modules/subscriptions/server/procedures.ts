import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { db } from "@/db";
import { subscriptions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const subscriptionsRouter = createTRPCRouter({
  subscribe: protectedProcedure
    .input(z.object({ userId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;

      if (userId === ctx.user.id) {
        // Trying to subscribe themselves
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [createdSubscription] = await db
        .insert(subscriptions)
        .values({
          viewerId: ctx.user.id,
          creatorId: userId,
        })
        .returning();

      if (!createdSubscription) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return createdSubscription;
    }),
  unsubscribe: protectedProcedure
    .input(z.object({ userId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = input;

      if (userId === ctx.user.id) {
        // Trying to unsubscribe themselves
        throw new TRPCError({ code: "BAD_REQUEST" });
      }

      const [deletedSubscription] = await db
        .delete(subscriptions)
        .where(
          and(
            eq(subscriptions.viewerId, ctx.user.id),
            eq(subscriptions.creatorId, userId),
          ),
        )
        .returning();

      if (!deletedSubscription) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return deletedSubscription;
    }),
});
