import { ApiModelProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class LoginVm {
  @IsEmail()
  @ApiModelProperty() email: string;
  @ApiModelProperty() password: string;
}