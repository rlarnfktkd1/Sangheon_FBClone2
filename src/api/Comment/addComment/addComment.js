import { prisma } from "../../../../generated/prisma-client";

export default {
  Mutation: {
    addComment: async (_, args, { request, isAuthenticated }) => {
      isAuthenticated(request);
      const { text, postId } = args;
      const { user } = request;
      const comment = await prisma.createComment({
        post: {
          connect: {
            id: postId
          }
        },
        user: {
          connect: {
            id: user.id
          }
        },
        text
      });
      return comment;
    }
  }
};
