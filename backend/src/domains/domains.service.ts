import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDomainDto } from './dto/create-domain.dto';
import { UpdateDomainDto } from './dto/update-domain.dto';

@Injectable()
export class DomainsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.domain.findMany({ orderBy: { name: 'asc' } });
  }

  findOne(id: number) {
    return this.prisma.domain.findUnique({ where: { id } });
  }

  create(dto: CreateDomainDto) {
    return this.prisma.domain.create({
      data: {
        name: dto.name,
        description: dto.description ?? undefined,
        isActive: dto.isActive ?? true,
      },
    });
  }

  update(id: number, dto: UpdateDomainDto) {
    return this.prisma.domain.update({
      where: { id },
      data: {
        ...(dto.name != null && { name: dto.name }),
        ...(dto.description !== undefined && { description: dto.description }),
        ...(dto.isActive !== undefined && { isActive: dto.isActive }),
      },
    });
  }

  remove(id: number) {
    return this.prisma.domain.delete({ where: { id } });
  }
}
