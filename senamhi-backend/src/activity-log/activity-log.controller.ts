import { Controller, Get, Query } from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';

@Controller('activity-logs')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get('recent')
  async getRecent(@Query('limit') limit?: number) {
    // Parse limit to number, default to 5 if not provided or invalid
    const limitNum = limit ? parseInt(limit.toString(), 10) : 5;
    return this.activityLogService.getRecentLogs(isNaN(limitNum) ? 5 : limitNum);
  }
}
