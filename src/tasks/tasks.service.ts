import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { TaskDto } from './dto/tasks.dto';
import { TaskFIlterDto } from './dto/search_and_filter_task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getallTask(): Task[] {
    return [...this.tasks];
  }

  getandFilterTask(taskFilter: TaskFIlterDto) {
    const { status, search } = taskFilter;
    let tasks = this.getallTask();

    if (status) {
      tasks = tasks.filter(task => task.status == status);
    }

    if (search) {
      tasks = tasks.filter(task => {
        return task.title.includes(search) || task.description.includes(search);
      });
    }

    return tasks;
  }

  createTask(taskDto: TaskDto): Task {
    const { title, description } = taskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  findbyId(id: string): Task {
    const found = this.tasks.find(task => task.id === id);
    if (!found) {
      throw new NotFoundException(`Task with ${id} not found`);
    }
    return found;
  }

  deleteTask(id: string): void {
    this.tasks = this.tasks.filter(task => task.id !== id);
  }

  updateTaskStatus(status: TaskStatus, id: string): Task {
    const task = this.findbyId(id);
    task.status = status;
    return task;
  }
}
