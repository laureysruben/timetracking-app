import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('users')
  reportByUsers(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('domainId') domainId?: string,
    @Query('projectId') projectId?: string,
  ) {
    return this.reportsService.reportByUsers({
      from,
      to,
      domainId: domainId ? Number(domainId) : undefined,
      projectId: projectId ? Number(projectId) : undefined,
    });
  }

  @Get('projects')
  reportByProjects(
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('domainId') domainId?: string,
  ) {
    return this.reportsService.reportByProjects({
      from,
      to,
      domainId: domainId ? Number(domainId) : undefined,
    });
  }

  @Get('domains')
  reportByDomains(@Query('from') from?: string, @Query('to') to?: string) {
    return this.reportsService.reportByDomains({ from, to });
  }
}
