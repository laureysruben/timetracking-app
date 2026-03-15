import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(domainId?: number) {
    return this.prisma.project.findMany({
      where: domainId != null ? { domainId } : undefined,
      include: { domain: true },
      orderBy: { name: 'asc' },
    });
  }

  findOne(id: number) {
    return this.prisma.project.findUnique({
      where: { id },
      include: { domain: true, tasks: true },
    });
  }

  async create(dto: CreateProjectDto) {
    const domain = await this.prisma.domain.findUnique({ where: { id: dto.domainId } });
    if (!domain) {
      throw new BadRequestException('Domain not found');
    }
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description ?? undefined,
        isActive: dto.isActive ?? true,
        domainId: dto.domainId,
      },
      include: { domain: true },
    });
  }

  update(id: number, dto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { id },
      data: {
        ...(dto.name != null && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
        ...(dto.domainId != null && { domainId: dto.domainId }),
      },
      include: { domain: true },
    });
  }

  remove(id: number) {
    return this.prisma.project.delete({ where: { id } });
  }
}
