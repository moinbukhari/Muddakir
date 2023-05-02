import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const learnRouter = createTRPCRouter({
  learn: publicProcedure
    .input(z.object({ wordLearntId: z.number(), learntById: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userExists = await ctx.prisma.user.findUnique({
        where: { id: input.learntById },
      });
      console.log(userExists);
      if (!userExists) {
        console.log("User didn't exist in database");
        await ctx.prisma.user.create({
          data: { id: input.learntById },
        });
      }
      const voteInDb = await ctx.prisma.learn.create({
        data: {
          wordId: input.wordLearntId,
          userId: input.learntById,
        },
      });

      return { success: true, vote: voteInDb };
    }),

  unlearn: publicProcedure
    .input(z.object({ wordLearntId: z.number(), learntById: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.learn.delete({
        where: {
          userId_wordId: {
            userId: input.learntById,
            wordId: input.wordLearntId
          }
        },
      });

      return { success: true, res: result };
    }),

  userWords: publicProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ ctx, input }) => {
      if (input.userId === "") {
        return undefined;
      }
      const userExists = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
      });
      console.log(userExists);
      if (!userExists) {
        console.log("User didn't exist in database");
        await ctx.prisma.user.create({
          data: { id: input.userId },
        });
      }
      const wordsLearned = await ctx.prisma.user.findUnique({
        where: { id: input.userId },
        include: { words: { include: { word: true } } },
      });

      return wordsLearned?.words.map((learn) => learn.word);
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.word.findMany();
  }),
});
