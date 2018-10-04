import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, VerifiedCallback } from 'passport-jwt';
import { Configuration } from '../../configuration/configuration.enum';
import { ConfigurationService } from '../../configuration/configuration.service';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../jwt-payload.model';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly _authService: AuthService,
    private readonly _configulationService: ConfigurationService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: _configulationService.get(Configuration.JWT_KEY),
    });
  }

  async validate(payload: JwtPayload, done: VerifiedCallback) {
    const user = await this._authService.validatePayload(payload);

    if (!user) {
      return done(new HttpException({}, HttpStatus.UNAUTHORIZED), false);
    }

    return done(null, user, payload.iat);
  }
}
