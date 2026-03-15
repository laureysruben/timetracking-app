import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { TasksService } from '../tasks/tasks.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { CreateTaskDto } from '../tasks/dto/create-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(
    private readonly projectsService: ProjectsService,
    private readonly tasksService: TasksService,
  ) {}

  @Get()
  findAll(@Query('domainId') domainId?: string) {
    return this.projectsService.findAll(domainId ? Number(domainId) : undefined);
  }

  @Get(':projectId/tasks')
  getTasks(@Param('projectId') projectId: string) {
    return this.tasksService.findByProject(Number(projectId));
  }

  @Post(':projectId/tasks')
  createTask(@Param('projectId') projectId: string, @Body() dto: CreateTaskDto) {
    return this.tasksService.create(Number(projectId), dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(Number(id));
  }

  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.projectsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(Number(id), dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(Number(id));
  }
}
