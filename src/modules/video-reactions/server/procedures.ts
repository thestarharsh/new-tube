import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { db } from "@/db";
import { videoReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videoReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ videoId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { videoId } = input;
      const { id: userId } = ctx.user;

      const [existingVideoReactionLike] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.userId, userId),
            eq(videoReactions.type, "like"),
          ),
        );

      if (existingVideoReactionLike) {
        const [deletedVideoReaction] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.videoId, videoId),
              eq(videoReactions.userId, userId),
              eq(videoReactions.type, "like"),
            ),
          )
          .returning();

        if (!deletedVideoReaction) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        return deletedVideoReaction;
      }

      const [createdVideoReaction] = await db
        .insert(videoReactions)
        .values({
          videoId,
          userId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [videoReactions.videoId, videoReactions.userId],
          set: { type: "like" },
        })
        .returning();

      if (!createdVideoReaction) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return createdVideoReaction;
    }),
  dislike: protectedProcedure
    .input(z.object({ videoId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { videoId } = input;
      const { id: userId } = ctx.user;

      const [existingVideoReactionDislike] = await db
        .select()
        .from(videoReactions)
        .where(
          and(
            eq(videoReactions.videoId, videoId),
            eq(videoReactions.userId, userId),
            eq(videoReactions.type, "dislike"),
          ),
        );

      if (existingVideoReactionDislike) {
        const [deletedVideoReaction] = await db
          .delete(videoReactions)
          .where(
            and(
              eq(videoReactions.videoId, videoId),
              eq(videoReactions.userId, userId),
              eq(videoReactions.type, "dislike"),
            ),
          )
          .returning();

        if (!deletedVideoReaction) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        return deletedVideoReaction;
      }

      const [createdVideoReaction] = await db
        .insert(videoReactions)
        .values({
          videoId,
          userId,
          type: "dislike",
        })
        .onConflictDoUpdate({
          target: [videoReactions.videoId, videoReactions.userId],
          set: { type: "dislike" },
        })
        .returning();

      if (!createdVideoReaction) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return createdVideoReaction;
    }),
});
