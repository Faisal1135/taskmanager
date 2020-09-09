import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { TaskFIlterDto } from './dto/search_and_filter_task.dto';

import { TaskDto } from './dto/tasks.dto';
import { Task, TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getAllTak(@Query() filterTask: TaskFIlterDto): Task[] {
    if (Object.keys(filterTask).length > 0) {
      return this.taskService.getandFilterTask(filterTask);
    } else {
      return this.taskService.getandFilterTask(filterTask);
    }
  }

  @Post()
  createTask(@Body() taskDto: TaskDto): Task {
    return this.taskService.createTask(taskDto);
  }

  @Get(':id')
  getByID(@Param('id') id: string): Task {
    return this.taskService.findbyId(id);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string): void {
    this.taskService.deleteTask(id);
  }

  @Patch(':id')
  updateTask(
    @Param('id') id: string,
    @Body('status') status: TaskStatus,
  ): Task {
    return this.taskService.updateTaskStatus(status, id);
  }
}
