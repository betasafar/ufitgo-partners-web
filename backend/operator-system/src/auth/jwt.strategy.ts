import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('OPERATOR_JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    // payload has sub (operatorId), role, etc.
    const operator = await this.authService.findById(payload.sub);
    if (!operator) {
      return null;
    }

    // Return minimal safe data
    return {
      id: operator.id,
      email: operator.email,
      companyName: operator.companyName,
      verificationStatus: operator.verificationStatus,
    };
  }
}
