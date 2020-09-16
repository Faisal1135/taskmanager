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
  Res,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Response } from 'express';
import * as pdfkit from 'pdfkit';
import { AuthGuard } from '@nestjs/passport';
import * as fs from 'fs';
import * as path from 'path';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.entity';
import { TaskFIlterDto } from './dto/search_and_filter_task.dto';

import { TaskDto } from './dto/tasks.dto';
import { TaskEntity } from './task.entity';
import { TaskStatus } from './tasks.model';
import { TasksService } from './tasks.service';

@Controller('tasks')
// @UseGuards(AuthGuard('jwt'))
export class TasksController {
  constructor(private taskService: TasksService) {}

  @Get()
  getTask(@Query() taskFilter: TaskFIlterDto): Promise<TaskEntity[]> {
    return this.taskService.getTask(taskFilter);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() taskDto: TaskDto,
    @GetUser() user: User,
  ): Promise<TaskEntity> {
    return this.taskService.createTask(taskDto, user);
  }

  @Get('getfile/:id')
  async getfile(@Res() res: Response, @Param('id', ParseIntPipe) id: number) {
    const task = await this.getByID(id);
    const filename = 'demo' + Date.now().toString() + '.pdf';
    // const filepath = path.join('src', 'assets', filename);

    res.setHeader('Content-Type', 'application/pdf');
    const pdfDoc = new pdfkit();
    pdfDoc.pipe(res);

    pdfDoc.text('Hello world');
    pdfDoc.text('--------------------------------');
    pdfDoc.text(task.title);
    pdfDoc.text(task.description);
    pdfDoc.end();

    // res.setHeader(
    //   'Content-Disposition',
    //   'attachment;filename="' + filename + '"',
    // );
    // const filestm = fs.createReadStream(filepath);

    // pdfDoc.pipe(fs.createWriteStream(filepath));
    // filestm.pipe(res);
    // return fs.readFile(filepath, (err, data) => {
    //   if (err) {
    //     throw err;
    //   }
    //   // console.log(data);

    //   res.send(data);
    // });
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
