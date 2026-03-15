import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  findByProject(projectId: number) {
    return this.prisma.task.findMany({
      where: { projectId },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.task.findUnique({
      where: { id },
      include: { project: true },
    });
  }

  create(projectId: number, dto: CreateTaskDto) {
    return this.prisma.task.create({
      data: {
        name: dto.name,
        description: dto.description ?? undefined,
        isActive: dto.isActive ?? true,
        projectId,
      },
      include: { project: true },
    });
  }

  update(id: number, dto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: {
        ...(dto.name != null && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.projectId != null && { projectId: dto.projectId }),
      },
      include: { project: true },
    });
  }

  remove(id: number) {
    return this.prisma.task.delete({ where: { id } });
  }
}
