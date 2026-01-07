import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { db } from "@/db";
import { comments } from "@/db/schema";
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
    .input(z.object({ videoId: z.uuid() }))
    .query(async ({ input }) => {
      const { videoId } = input;

      const data = await db
        .select()
        .from(comments)
        .where(eq(comments.videoId, videoId));

      return data;
    }),
});
