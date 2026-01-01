import { and, eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import z from "zod";

import { db } from "@/db";
import { videoViews } from "@/db/schema";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const videoViewsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ videoId: z.uuid() }))
    .mutation(async ({ ctx, input }) => {
      const { videoId } = input;
      const { id: userId } = ctx.user;

      const [existingVideoView] = await db
        .select()
        .from(videoViews)
        .where(
          and(eq(videoViews.videoId, videoId), eq(videoViews.userId, userId)),
        );

      if (existingVideoView) {
        return existingVideoView;
      }

      const [createdVideoView] = await db
        .insert(videoViews)
        .values({
          videoId,
          userId,
        })
        .returning();

      if (!createdVideoView) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return createdVideoView;
    }),
});
