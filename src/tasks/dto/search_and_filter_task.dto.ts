import { TaskStatus } from '../tasks.model';

import {
  isIn,
  IsIn,
  IsNotEmpty,
  isNotEmpty,
  IsOptional,
} from 'class-validator';

export class TaskFIlterDto {
  @IsOptional()
  @IsIn([TaskStatus.OPEN, TaskStatus.IN_PROGRESS, TaskStatus.DONE])
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}
