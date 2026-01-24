import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { db } from "@/db";
import { commentReactions } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const commentReactionsRouter = createTRPCRouter({
  like: protectedProcedure
    .input(z.object({ commentId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const { id: userId } = ctx.user;

      const [existingCommentReactionLike] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.userId, userId),
            eq(commentReactions.type, "like"),
          ),
        );

      if (existingCommentReactionLike) {
        const [deletedCommentReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.commentId, commentId),
              eq(commentReactions.userId, userId),
              eq(commentReactions.type, "like"),
            ),
          )
          .returning();

        if (!deletedCommentReaction) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        return deletedCommentReaction;
      }

      const [createdCommentReaction] = await db
        .insert(commentReactions)
        .values({
          commentId,
          userId,
          type: "like",
        })
        .onConflictDoUpdate({
          target: [commentReactions.commentId, commentReactions.userId],
          set: { type: "like" },
        })
        .returning();

      if (!createdCommentReaction) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return createdCommentReaction;
    }),
  dislike: protectedProcedure
    .input(z.object({ commentId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const { id: userId } = ctx.user;

      const [existingCommentReactionDislike] = await db
        .select()
        .from(commentReactions)
        .where(
          and(
            eq(commentReactions.commentId, commentId),
            eq(commentReactions.userId, userId),
            eq(commentReactions.type, "dislike"),
          ),
        );

      if (existingCommentReactionDislike) {
        const [deletedCommentReaction] = await db
          .delete(commentReactions)
          .where(
            and(
              eq(commentReactions.commentId, commentId),
              eq(commentReactions.userId, userId),
              eq(commentReactions.type, "dislike"),
            ),
          )
          .returning();

        if (!deletedCommentReaction) {
          throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        }

        return deletedCommentReaction;
      }

      const [createdCommentReaction] = await db
        .insert(commentReactions)
        .values({
          commentId,
          userId,
          type: "dislike",
        })
        .onConflictDoUpdate({
          target: [commentReactions.commentId, commentReactions.userId],
          set: { type: "dislike" },
        })
        .returning();

      if (!createdCommentReaction) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return createdCommentReaction;
    }),
});
