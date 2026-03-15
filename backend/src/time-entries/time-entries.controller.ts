import { Controller, Get, Post, Patch, Delete, Body, Param, Query, Req } from '@nestjs/common';
import { TimeEntriesService } from './time-entries.service';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

@Controller('time-entries')
export class TimeEntriesController {
  constructor(private readonly timeEntriesService: TimeEntriesService) {}

  @Get()
  list(
    @Req() req: any,
    @Query('from') from?: string,
    @Query('to') to?: string,
    @Query('projectId') projectId?: string,
    @Query('domainId') domainId?: string,
    @Query('userId') targetUserId?: string,
  ) {
    const user = req.user as { userId: number; role: string };
    const isAdmin = user.role === 'ADMIN';
    return this.timeEntriesService.listForUser({
      userId: user.userId,
      isAdmin,
      from,
      to,
      projectId: projectId ? Number(projectId) : undefined,
      domainId: domainId ? Number(domainId) : undefined,
      targetUserId: targetUserId ? Number(targetUserId) : undefined,
    });
  }

  @Post()
  create(@Req() req: any, @Body() dto: CreateTimeEntryDto) {
    const user = req.user as { userId: number };
    return this.timeEntriesService.createForUser(user.userId, dto);
  }

  @Patch(':id')
  update(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateTimeEntryDto) {
    const user = req.user as { userId: number; role: string };
    const isAdmin = user.role === 'ADMIN';
    return this.timeEntriesService.updateForUser(user.userId, Number(id), dto, isAdmin);
  }

  @Delete(':id')
  async delete(@Req() req: any, @Param('id') id: string) {
    const user = req.user as { userId: number; role: string };
    const isAdmin = user.role === 'ADMIN';
    await this.timeEntriesService.deleteForUser(user.userId, Number(id), isAdmin);
    return { success: true };
  }
}

