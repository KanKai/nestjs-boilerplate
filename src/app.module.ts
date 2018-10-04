import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Configuration } from 'shared/configuration/configuration.enum';
import { ConfigurationService } from 'shared/configuration/configuration.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SharedModule } from './shared/shared.module';
import { TodoModule } from './todo/todo.module';
import { TodoService } from './todo/todo.service';
import { UserModule } from './user/user.module';

// Set mongoose duplicate index
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

@Module({
  imports: [SharedModule, MongooseModule.forRoot(ConfigurationService.connectionString, { useNewUrlParser: true }), UserModule, TodoModule],
  controllers: [AppController],
  providers: [AppService, TodoService],
})
export class AppModule {
  static host: string;
  static port: number | string;
  static isDev: boolean;

  constructor(private readonly _configurationService: ConfigurationService) {
    AppModule.port = AppModule.normalizePort(_configurationService.get(Configuration.PORT));
    AppModule.host = _configurationService.get(Configuration.HOST);
    AppModule.isDev = _configurationService.isDevelopment;
  }

  private static normalizePort(param: number | string): number | string {
    const portNumber: number = typeof param === 'string' ? parseInt(param, 10) : param;
    if (isNaN(portNumber)) return param;
    else if (portNumber >= 0) return portNumber;
  }
}
