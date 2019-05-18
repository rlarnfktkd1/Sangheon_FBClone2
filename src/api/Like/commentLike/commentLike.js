import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    commentLike: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { commentId } = args;
      const { user } = request;
      const filterOptions = {
        AND: [
          {
            user: {
              id: user.id
            }
          },
          {
            comment: {
              id: commentId
            }
          }
        ]
      };
      try {
        const commentLike = await prisma.$exists.like(filterOptions);
        if (commentLike) {
          await prisma.deleteManyLikes(filterOptions);
          return false;
        } else {
          await prisma.createLike({
            user: {
              connect: {
                id: user.id
              }
            },
            comment: {
              connect: {
                id: commentId
              }
            }
          });
        }
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
  }
};
