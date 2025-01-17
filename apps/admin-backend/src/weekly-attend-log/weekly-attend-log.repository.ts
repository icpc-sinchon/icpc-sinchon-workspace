import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma } from "@prisma/client";
import { WeeklyAttendLogEntity } from "./entities/weekly-attend-log.entity";

@Injectable()
export class WeeklyAttendLogRepository {
  constructor(private prisma: PrismaService) {}

  async createWeeklyAttendLog(params: {
    data: Prisma.WeeklyAttendLogCreateInput;
  }): Promise<WeeklyAttendLogEntity> {
    const { data } = params;
    return this.prisma.weeklyAttendLog.create({ data });
  }

  async getAllWeeklyAttendLogs(): Promise<WeeklyAttendLogEntity[]> {
    return this.prisma.weeklyAttendLog.findMany();
  }

  async getWeeklyAttendLog(params: {
    where: Prisma.WeeklyAttendLogWhereUniqueInput;
  }): Promise<WeeklyAttendLogEntity> {
    const { where } = params;
    return this.prisma.weeklyAttendLog.findUnique({ where });
  }

  async getWeeklyAttendLogs(params: {
    where: Prisma.WeeklyAttendLogWhereInput;
  }): Promise<WeeklyAttendLogEntity[]> {
    const { where } = params;
    return this.prisma.weeklyAttendLog.findMany({ where });
  }

  async updateWeeklyAttendLog(params: {
    where: Prisma.WeeklyAttendLogWhereUniqueInput;
    data: Prisma.WeeklyAttendLogUpdateInput;
  }): Promise<WeeklyAttendLogEntity> {
    const { where, data } = params;
    return this.prisma.weeklyAttendLog.update({ where, data });
  }

  async deleteWeeklyAttendLog(params: {
    where: Prisma.WeeklyAttendLogWhereUniqueInput;
  }): Promise<WeeklyAttendLogEntity> {
    const { where } = params;
    return this.prisma.weeklyAttendLog.delete({ where });
  }

  async resetWeeklyAttendLog(): Promise<void> {
    await this.prisma.weeklyAttendLog.deleteMany();
  }
}
