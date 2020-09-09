import { TaskStatus } from '../tasks.model';

export class TaskFIlterDto {
  status: TaskStatus;
  search: string;
}
