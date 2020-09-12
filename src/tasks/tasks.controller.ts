import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TaskFIlterDto } from './dto/search_and_filter_task.dto';

import { TaskDto } from './dto/tasks.dto';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTask(@Query() taskFilter: TaskFIlterDto): Promise<TaskEntity[]> {
    return this.taskService.getTask(taskFilter);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() taskDto: TaskDto): Promise<TaskEntity> {
    return this.taskService.createTask(taskDto);
  }

  @Get(':id')
  getByID(@Param('id', ParseIntPipe) id: number): Promise<TaskEntity> {
    return this.taskService.getTaskById(id);
  }

  @Delete(':id')
  deleteTask(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.taskService.deleteTask(id);
  }

  @Patch(':id')
  updateTask(
    @Param('id', ParseIntPipe) id: number,
    @Body('status') status: TaskStatus,
  ): Promise<TaskEntity> {
    return this.taskService.updateTaskStatus(status, id);
  }
}
