import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks.model';

import { TaskDto } from './dto/tasks.dto';
import { TaskFIlterDto } from './dto/search_and_filter_task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { User } from 'src/auth/user.entity';
import { Response } from 'express';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRespository: TaskRepository,
  ) {}

  async getTask(taskfilterDto: TaskFIlterDto): Promise<TaskEntity[]> {
    return this.taskRespository.getTask(taskfilterDto);
  }

  async getTaskById(id: number): Promise<TaskEntity> {
    const found = await this.taskRespository.findOne(id);

    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }

  async createTask(taskDto: TaskDto, user: User): Promise<TaskEntity> {
    return this.taskRespository.createTask(taskDto, user);
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRespository.delete(id);

    if (result.affected === 0)
      throw new NotFoundException(`Task with id - ${id} Not found`);
  }
  async updateTaskStatus(status: TaskStatus, id: number): Promise<TaskEntity> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }

  getandSendFile(response: Response, filepath: string) {}
}
