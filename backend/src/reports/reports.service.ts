import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface ReportByUserRow {
  userId: number;
  userName: string;
  userEmail: string;
  totalMinutes: number;
}

export interface ReportByProjectRow {
  projectId: number;
  projectName: string;
  domainName: string;
  totalMinutes: number;
}

export interface ReportByDomainRow {
  domainId: number;
  domainName: string;
  totalMinutes: number;
}

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  async reportByUsers(params: {
    from?: string;
    to?: string;
    domainId?: number;
    projectId?: number;
  }): Promise<ReportByUserRow[]> {
    const where: Record<string, unknown> = {};
    if (params.from || params.to) {
      where.start = {};
      if (params.from) (where.start as Record<string, Date>).gte = new Date(params.from);
      if (params.to) (where.start as Record<string, Date>).lte = new Date(params.to);
    }
    if (params.domainId) where.domainId = params.domainId;
    if (params.projectId) where.projectId = params.projectId;

    const aggregated = await this.prisma.timeEntry.groupBy({
      by: ['userId'],
      where,
      _sum: { durationMinutes: true },
    });

    const userIds = aggregated.map((a) => a.userId);
    const users = await this.prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    });
    const userMap = new Map(users.map((u) => [u.id, u]));

    return aggregated
      .filter((a) => a._sum.durationMinutes != null && a._sum.durationMinutes > 0)
      .map((a) => {
        const u = userMap.get(a.userId);
        return {
          userId: a.userId,
          userName: u?.name ?? '',
          userEmail: u?.email ?? '',
          totalMinutes: a._sum.durationMinutes ?? 0,
        };
      })
      .sort((a, b) => b.totalMinutes - a.totalMinutes);
  }

  async reportByProjects(params: {
    from?: string;
    to?: string;
    domainId?: number;
  }): Promise<ReportByProjectRow[]> {
    const where: Record<string, unknown> = {};
    if (params.from || params.to) {
      where.start = {};
      if (params.from) (where.start as Record<string, Date>).gte = new Date(params.from);
      if (params.to) (where.start as Record<string, Date>).lte = new Date(params.to);
    }
    if (params.domainId) where.domainId = params.domainId;

    const aggregated = await this.prisma.timeEntry.groupBy({
      by: ['projectId'],
      where,
      _sum: { durationMinutes: true },
    });

    const projectIds = aggregated.map((a) => a.projectId);
    const projects = await this.prisma.project.findMany({
      where: { id: { in: projectIds } },
      include: { domain: true },
    });
    const projectMap = new Map(projects.map((p) => [p.id, p]));

    return aggregated
      .filter((a) => a._sum.durationMinutes != null && a._sum.durationMinutes > 0)
      .map((a) => {
        const p = projectMap.get(a.projectId);
        return {
          projectId: a.projectId,
          projectName: p?.name ?? '',
          domainName: p?.domain?.name ?? '',
          totalMinutes: a._sum.durationMinutes ?? 0,
        };
      })
      .sort((a, b) => b.totalMinutes - a.totalMinutes);
  }

  async reportByDomains(params: { from?: string; to?: string }): Promise<ReportByDomainRow[]> {
    const where: Record<string, unknown> = {};
    if (params.from || params.to) {
      where.start = {};
      if (params.from) (where.start as Record<string, Date>).gte = new Date(params.from);
      if (params.to) (where.start as Record<string, Date>).lte = new Date(params.to);
    }

    const aggregated = await this.prisma.timeEntry.groupBy({
      by: ['domainId'],
      where,
      _sum: { durationMinutes: true },
    });

    const domainIds = aggregated.map((a) => a.domainId);
    const domains = await this.prisma.domain.findMany({
      where: { id: { in: domainIds } },
      select: { id: true, name: true },
    });
    const domainMap = new Map(domains.map((d) => [d.id, d]));

    return aggregated
      .filter((a) => a._sum.durationMinutes != null && a._sum.durationMinutes > 0)
      .map((a) => ({
        domainId: a.domainId,
        domainName: domainMap.get(a.domainId)?.name ?? '',
        totalMinutes: a._sum.durationMinutes ?? 0,
      }))
      .sort((a, b) => b.totalMinutes - a.totalMinutes);
  }
}
