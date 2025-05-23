import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt"


export class jwtStrategy extends PassportStrategy(Strategy) {
    constructor() {
        super({
            jjwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        })
    }

    async validate(payload: any){
        return {userId: payload.sub, email: payload.email, role: payload.role}
    }

}