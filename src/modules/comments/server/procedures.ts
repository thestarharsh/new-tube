import {
  and,
  count,
  desc,
  eq,
  getTableColumns,
  inArray,
  lt,
  or,
} from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { db } from "@/db";
import { commentReactions, comments, users } from "@/db/schema";
import {
  baseProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/trpc/init";

export const commentsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        videoId: z.uuid(),
        comment: z.string().min(1),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { videoId, comment } = input;
      const { id: userId } = ctx.user;

      const [createdComment] = await db
        .insert(comments)
        .values({
          videoId,
          userId,
          comment,
        })
        .returning();

      if (!createdComment) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return createdComment;
    }),
  getMany: baseProcedure
    .input(
      z.object({
        videoId: z.uuid(),
        cursor: z
          .object({
            id: z.uuid(),
            updatedAt: z.date(),
          })
          .nullish(),
        limit: z.number().min(1).max(100),
      }),
    )
    .query(async ({ input, ctx }) => {
      const { clerkUserId } = ctx;
      const { videoId, cursor, limit } = input;

      let userId = null;
      const [user] = await db
        .select({
          id: users.id,
        })
        .from(users)
        .where(inArray(users.clerkId, clerkUserId ? [clerkUserId] : []));

      if (user) {
        userId = user.id;
      }

      const viewerReaction = db.$with("viewer_reaction").as(
        db
          .select({
            commentId: commentReactions.commentId,
            type: commentReactions.type,
          })
          .from(commentReactions)
          .where(inArray(commentReactions.userId, userId ? [userId] : [])),
      );

      const [totalData, data] = await Promise.all([
        db
          .select({
            count: count(),
          })
          .from(comments)
          .where(eq(comments.videoId, videoId)),
        db
          .with(viewerReaction)
          .select({
            ...getTableColumns(comments),
            user: users,
            viewerReaction: viewerReaction.type,
            likeCount: db.$count(
              commentReactions,
              and(
                eq(commentReactions.commentId, comments.id),
                eq(commentReactions.type, "like"),
              ),
            ),
            dislikeCount: db.$count(
              commentReactions,
              and(
                eq(commentReactions.commentId, comments.id),
                eq(commentReactions.type, "dislike"),
              ),
            ),
          })
          .from(comments)
          .where(
            and(
              eq(comments.videoId, videoId),
              cursor
                ? or(
                    lt(comments.updatedAt, cursor.updatedAt),
                    and(
                      eq(comments.updatedAt, cursor.updatedAt),
                      lt(comments.id, cursor.id),
                    ),
                  )
                : undefined,
            ),
          )
          .innerJoin(users, eq(comments.userId, users.id))
          .leftJoin(viewerReaction, eq(comments.id, viewerReaction.commentId))
          .orderBy(desc(comments.updatedAt), desc(comments.id))
          .limit(limit + 1),
      ]);

      const hasMore = data?.length > limit;
      const items = hasMore ? data.slice(0, -1) : data; // Remove last item if has more

      const lastItem = items[items.length - 1];
      const nextCursor = hasMore
        ? {
            id: lastItem.id,
            updatedAt: lastItem.updatedAt,
          }
        : null;

      return {
        items,
        nextCursor,
        totalCount: totalData[0].count,
      };
    }),
  remove: protectedProcedure
    .input(
      z.object({
        commentId: z.uuid(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { commentId } = input;
      const { id: userId } = ctx.user;

      const [deletedComment] = await db
        .delete(comments)
        .where(and(eq(comments.id, commentId), eq(comments.userId, userId)))
        .returning();

      if (!deletedComment) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return deletedComment;
    }),
});
