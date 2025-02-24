import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import type { Prisma } from "@prisma/client";
import { RefundPolicyEntity } from "./entities/refund-policy.entity";

@Injectable()
export class RefundPolicyRepository {
  constructor(private prisma: PrismaService) {}

  async createRefundPolicy(
    data: Prisma.RefundPolicyCreateInput,
  ): Promise<RefundPolicyEntity> {
    return this.prisma.refundPolicy.create({ data });
  }

  async createRefundPolicies(
    data: Prisma.RefundPolicyCreateManyInput[],
  ): Promise<number> {
    const result = await this.prisma.refundPolicy.createMany({
      data,
      skipDuplicates: true,
    });
    return result.count;
  }

  async getAllRefundPolicies(): Promise<RefundPolicyEntity[]> {
    return this.prisma.refundPolicy.findMany();
  }

  async getRefundPolicyById(id: number): Promise<RefundPolicyEntity> {
    return this.prisma.refundPolicy.findUnique({ where: { id } });
  }

  async getRefundPoliciesBySemester(
    semesterId: number,
  ): Promise<RefundPolicyEntity[]> {
    return this.prisma.refundPolicy.findMany({
      where: {
        semesterId,
      },
    });
  }

  async updateRefundPolicy(
    id: number,
    data: Prisma.RefundPolicyUpdateInput,
  ): Promise<RefundPolicyEntity> {
    return this.prisma.refundPolicy.update({ where: { id }, data });
  }

  async deleteRefundPolicy(id: number): Promise<RefundPolicyEntity> {
    return this.prisma.refundPolicy.delete({ where: { id } });
  }

  async resetRefundPolicies(): Promise<void> {
    await this.prisma.refundPolicy.deleteMany();
  }
}
