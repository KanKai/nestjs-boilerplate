import { ApiModelProperty } from '@nestjs/swagger';
import { EnumToArray } from 'shared/utilities/enum-to-array';
import { BaseModelVm } from '../../../shared/base.model';
import { TodoLevel } from '../todo-level.enum';

export class TodoVm extends BaseModelVm {
  @ApiModelProperty() content: string;
  @ApiModelProperty({ enum: EnumToArray(TodoLevel) }) level: TodoLevel;
  @ApiModelProperty() isCompleted: boolean;
}