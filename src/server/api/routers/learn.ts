import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const learnRouter = createTRPCRouter({
  learn: publicProcedure
    .input(z.object({ wordLearntId: z.number(), learntById: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const voteInDb = await ctx.prisma.learn.create({
        data: {
          wordId: input.wordLearntId,
          userId: input.learntById,
        },
      });

      return { success: true, vote: voteInDb };
    }),

  hasUserLearnt: publicProcedure
    .input(z.object({ wordId: z.number(), userId: z.string() }))
    .query(async ({ ctx, input }) => {
      const wordLearned = await ctx.prisma.learn.findFirst({
        where: { user: { id: input.userId }, word: { id: input.wordId } },
        include: { user: true, word: true },
      });

      if(wordLearned){
        return true;
      }
      
      return false
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.word.findMany();
  }),
});
