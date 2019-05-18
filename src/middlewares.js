export const isAuthenticated = request => {
  if (!request.user) {
    throw Error("이 기능은 로그인이 필요합니다!");
  }
  return;
};
