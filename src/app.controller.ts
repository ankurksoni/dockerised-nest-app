import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/health')
  getHealth(): string {
    return `I am healthy. Memory details: ${process.memoryUsage().heapUsed / 1024 / 1024} MB`;
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
