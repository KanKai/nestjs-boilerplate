import { ModelType, prop } from 'typegoose';
import { BaseModel, schemaOptions } from '../../shared/base.model';
import { UserRole } from './user-role.enum';

export const USER_MODEL = 'User';
export class User extends BaseModel<User> {
  @prop({
    required: [true, 'Email is required'],
    minlength: [6, 'Must be at least 6 characters'],
    unique: true,
  })
  email: string;
  @prop({ required: [true, 'Password is required'], minlength: [6, 'Must be at least 6 characters'] })
  password: string;
  @prop({ enum: UserRole, default: UserRole.User })
  role?: UserRole;
  @prop() firstName?: string;
  @prop() lastName?: string;

  @prop()
  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  static get model(): ModelType<User> {
    return new User().getModelForClass(User, { schemaOptions });
  }

  static get modelName(): string {
    return this.model.modelName;
  }
}