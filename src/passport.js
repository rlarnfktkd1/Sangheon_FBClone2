// passport는 인증관련 모든 일을 한다.(JWT 토큰이나 쿠키 정보 가져와서 사용자 정보에 serialize(저장)한다)
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";
import { prisma } from "../generated/prisma-client";

// secret은 passport 정보를 암호화하는데 필요한 비밀값
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

// user가 맞는지 확인 해주는 것.
const verifyUser = async (payload, done) => {
  try {
    const user = await prisma.user({ id: payload.id });
    if (user !== null) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  } catch (error) {
    return done(err, false);
  }
};
// passport 는 쿠키 세션 작업하기에 좋다. 쿠키를 가져오고 만들어주고 모든 일을한다.
// verifyUser함수가 끝나고 user값이 return 이 되서 넘어오면 req.user의 값을 user의 값으로 넣는것
// 토큰을 받아서 해석하고, 사용자를 찾고, 사용자 존재시, req객체에 사용자를 추가하고 나면 graphql 함수 실행
// 로그인 되어있다면 모든 graphql 요청에 사용자 정보가 추가되어서 요청이된다.
// 서버에 전달되는 모든 요청은 하단의 미들웨어를 통과한다.
// 그리고 이 미들웨어는 strategy를 이용해서 jwt 토큰을 추출한다.
// 토큰이 추출되면 verifyUser를 payload와 함께 실행한다.
// payload는 토큰에서 해석된 id를 받아서 user를 찾아서 리턴한다.
// 그리고 if(user)밑에를 실행을 한다.
export const authenticateJwt = (req, res, next) =>
  passport.authenticate("jwt", { sessions: false }, (error, user) => {
    if (user) {
      req.user = user;
    }
    next();
  })(req, res, next);

passport.use(new Strategy(jwtOptions, verifyUser));
passport.initialize();
