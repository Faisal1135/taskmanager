import { EntityRepository, Repository } from 'typeorm';
import { TaskEntity } from '../tasks/task.entity';
import { TaskFIlterDto } from './dto/search_and_filter_task.dto';
import { TaskDto } from './dto/tasks.dto';
import { TaskStatus } from './tasks.model';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity> {
  async getTask(taskfilterDto: TaskFIlterDto): Promise<TaskEntity[]> {
    const { status, search } = taskfilterDto;
    const query = this.createQueryBuilder('task');

    if (status) {
      query.andWhere('task.status = :status', { status });
    }

    if (search) {
      query.andWhere(
        '(task.title LIKE :search OR task.description LIKE :search)',
        { search: `%${search}%` },
      );
    }

    const tasks = await query.getMany();
    return tasks;
  }

  async createTask(taskDto: TaskDto): Promise<TaskEntity> {
    const { title, description } = taskDto;

    const task = new TaskEntity();
    task.title = title;
    task.description = description;
    task.status = TaskStatus.OPEN;
    await task.save();
    return task;
  }
}
