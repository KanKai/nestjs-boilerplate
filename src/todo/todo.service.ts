import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from 'shared/base.service';
import { MapperService } from 'shared/mapper/mapper.service';
import { ModelType } from 'typegoose';
import { Todo } from './models/todo.model';
import { TodoParams } from './models/view-models/todo-params.model';

@Injectable()
export class TodoService extends BaseService<Todo> {
  constructor(
    @InjectModel(Todo.modelName) private readonly _todoModel: ModelType<Todo>,
    private readonly _mapperService: MapperService,
  ) {
    super();
    this._model = _todoModel;
    this._mapper = _mapperService.mapper;
  }

  async createTodo(params: TodoParams): Promise<Todo> {
    const { content, level } = params;

    const newTodo = new this._model();

    newTodo.content = content;

    if (level) {
      newTodo.level = level;
    }

    try {
      const result = await this.create(newTodo);
      return result.toJSON() as Todo;
    } catch (e) {
      throw new HttpException(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
