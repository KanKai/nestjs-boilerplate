import { forwardRef, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { AuthService } from 'shared/auth/auth.service';
import { JwtPayload } from 'shared/auth/jwt-payload.model';
import { BaseService } from 'shared/base.service';
import { MapperService } from 'shared/mapper/mapper.service';
import { ModelType } from 'typegoose';
import { User } from './models/user.model';
import { LoginResponseVm } from './models/view-models/login-response-vm.model';
import { LoginVm } from './models/view-models/login-vm.model';
import { RegisterVm } from './models/view-models/register-vm.model';
import { UserVm } from './models/view-models/user-vm.model';

@Injectable()
export class UserService extends BaseService<User> {
  constructor(
    @InjectModel(User.modelName) private readonly _userModel: ModelType<User>,
    private readonly _mapperService: MapperService,
    @Inject(forwardRef(() => AuthService))
    readonly _authService: AuthService,
  ) {
    super();
    this._model = _userModel;
    this._mapper = _mapperService.mapper;
  }

  async register(registerVm: RegisterVm): Promise<User> {
    const { email, password, firstName, lastName } = registerVm;

    const newUser = new this._model(); // InstanceType<User>
    newUser.email = email;
    newUser.firstName = firstName;
    newUser.lastName = lastName;

    const salt = await genSaltSync(10);
    newUser.password = await hashSync(password, salt);

    try {
      const result = await this.create(newUser);
      return result.toJSON() as User;
    } catch (e) {
      // MongoError
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async login(loginVm: LoginVm): Promise<LoginResponseVm> {
    const { email, password } = loginVm;

    const user = await this.findOne({ email });
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const isMatch = await compareSync(password, user.password);

    if (!isMatch) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const payload: JwtPayload = {
      email: user.email,
      role: user.role,
    };

    const token = await this._authService.signPayload(payload);
    const userVm: UserVm = await this.map<UserVm>(user.toJSON());

    const response = {
      token,
      user: userVm,
    };

    return response;
  }
}
