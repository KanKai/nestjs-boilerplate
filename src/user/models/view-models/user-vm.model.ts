import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';
import { BaseModelVm } from '../../../shared/base.model';
import { EnumToArray } from '../../../shared/utilities/enum-to-array';
import { UserRole } from '../user-role.enum';

export class UserVm extends BaseModelVm {
  @ApiModelProperty({ example: 'example@email.com' }) email: string;
  @ApiModelPropertyOptional() firstName?: string;
  @ApiModelPropertyOptional() lastName?: string;
  @ApiModelPropertyOptional() fullName?: string;
  @ApiModelPropertyOptional({ enum: EnumToArray(UserRole) })
  role?: UserRole;
}