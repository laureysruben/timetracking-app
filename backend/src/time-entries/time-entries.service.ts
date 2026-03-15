import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

@Injectable()
export class TimeEntriesService {
  constructor(private readonly prisma: PrismaService) {}

  private computeDurationMinutes(start: Date, end: Date): number {
    const diffMs = end.getTime() - start.getTime();
    if (diffMs <= 0) {
      throw new ForbiddenException('End time must be after start time');
    }
    return Math.round(diffMs / 60000);
  }

  async createForUser(userId: number, dto: CreateTimeEntryDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: dto.taskId },
      include: { project: { include: { domain: true } } },
    });
    if (!task) {
      throw new ForbiddenException('Task not found');
    }
    const start = new Date(dto.start);
    const end = new Date(dto.end);
    const durationMinutes = this.computeDurationMinutes(start, end);

    return this.prisma.timeEntry.create({
      data: {
        start,
        end,
        durationMinutes,
        note: dto.note,
        userId,
        taskId: task.id,
        projectId: task.projectId,
        domainId: task.project.domainId,
      },
    });
  }

  async updateForUser(userId: number, entryId: number, dto: UpdateTimeEntryDto, isAdmin: boolean) {
    const existing = await this.prisma.timeEntry.findUnique({ where: { id: entryId } });
    if (!existing) {
      throw new ForbiddenException('Time entry not found');
    }
    if (!isAdmin && existing.userId !== userId) {
      throw new ForbiddenException('You can only modify your own time entries');
    }

    const start = dto.start ? new Date(dto.start) : existing.start;
    const end = dto.end ? new Date(dto.end) : existing.end;
    const durationMinutes = this.computeDurationMinutes(start, end);

    return this.prisma.timeEntry.update({
      where: { id: entryId },
      data: {
        start,
        end,
        durationMinutes,
        note: dto.note ?? existing.note,
      },
    });
  }

  async deleteForUser(userId: number, entryId: number, isAdmin: boolean) {
    const existing = await this.prisma.timeEntry.findUnique({ where: { id: entryId } });
    if (!existing) {
      return;
    }
    if (!isAdmin && existing.userId !== userId) {
      throw new ForbiddenException('You can only delete your own time entries');
    }
    await this.prisma.timeEntry.delete({ where: { id: entryId } });
  }

  async listForUser(params: {
    userId: number;
    isAdmin: boolean;
    from?: string;
    to?: string;
    projectId?: number;
    domainId?: number;
    targetUserId?: number;
  }) {
    const { userId, isAdmin, from, to, projectId, domainId, targetUserId } = params;
    const where: any = {};

    if (from || to) {
      where.start = {};
      if (from) {
        where.start.gte = new Date(from);
      }
      if (to) {
        where.start.lte = new Date(to);
      }
    }

    if (projectId) {
      where.projectId = projectId;
    }
    if (domainId) {
      where.domainId = domainId;
    }

    if (isAdmin && targetUserId) {
      where.userId = targetUserId;
    } else {
      where.userId = userId;
    }

    return this.prisma.timeEntry.findMany({
      where,
      orderBy: { start: 'desc' },
      include: {
        task: true,
        project: true,
        domain: true,
      },
    });
  }
}

