import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { TaskDto } from './dto/tasks.dto';
import { TaskFIlterDto } from './dto/search_and_filter_task.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';

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

  async createTask(taskDto: TaskDto): Promise<TaskEntity> {
    return this.taskRespository.createTask(taskDto);
    // const { title, description } = taskDto;

    // const task = new TaskEntity();
    // task.title = title;
    // task.description = description;
    // task.status = TaskStatus.OPEN;
    // await task.save();

    // return task;
  }

  async deleteTask(id: number): Promise<void> {
    const result = await this.taskRespository.delete(id);

    if (result.affected === 0)
      throw new NotFoundException(`Task with id - ${id} Not found`);
  }

  // private tasks: Task[] = [];
  // getallTask(): Task[] {
  //   return [...this.tasks];
  // }
  // getandFilterTask(taskFilter: TaskFIlterDto) {
  //   const { status, search } = taskFilter;
  //   let tasks = this.getallTask();
  //   if (status) {
  //     tasks = tasks.filter(task => task.status == status);
  //   }
  //   if (search) {
  //     tasks = tasks.filter(task => {
  //       return task.title.includes(search) || task.description.includes(search);
  //     });
  //   }
  //   return tasks;
  // }
  // createTask(taskDto: TaskDto): Promise<TaskEntity> {
  //   const { title, description } = taskDto;
  //   // const task: Task = {
  //   //   id: uuid(),
  //   //   title,
  //   //   description,
  //   //   status: TaskStatus.OPEN,
  //   // };
  //   this.tasks.push(task);
  //   return task;
  // }
  // findbyId(id: string): Task {
  //   const found = this.tasks.find(task => task.id === id);
  //   if (!found) {
  //     throw new NotFoundException(`Task with ${id} not found`);
  //   }
  //   return found;
  // }
  // deleteTask(id: string): void {
  //   this.tasks = this.tasks.filter(task => task.id !== id);
  // }
  async updateTaskStatus(status: TaskStatus, id: number): Promise<TaskEntity> {
    const task = await this.getTaskById(id);
    task.status = status;
    await task.save();
    return task;
  }
}
