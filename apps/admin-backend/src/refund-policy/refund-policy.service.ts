import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import type { Prisma, Season } from "@prisma/client";
import { CreateRefundPolicyDto } from "./dto/create-refund-policy.dto";
import { UpdateRefundPolicyDto } from "./dto/update-refund-policy.dto";
import { RefundPolicyEntity } from "./entities/refund-policy.entity";
import { RefundPolicyRepository } from "./refund-policy.repository";
import { SemesterRepository } from "../semester/semester.repository";

@Injectable()
export class RefundPolicyService {
  constructor(
    private readonly refundPolicyRepository: RefundPolicyRepository,
    private readonly semesterRepository: SemesterRepository,
  ) {}

  async createRefundPolicy(
    createRefundPolicyDto: CreateRefundPolicyDto,
  ): Promise<RefundPolicyEntity> {
    const { semesterId, ...refundPolicyData } = createRefundPolicyDto;
    try {
      const semester =
        await this.semesterRepository.getSemesterById(semesterId);
      if (!semester) {
        throw new NotFoundException(`Semester with ID ${semesterId} not found`);
      }

      const existingPolicies =
        await this.refundPolicyRepository.getRefundPoliciesBySemester(
          semesterId,
        );

      const noOverlap = this.verifyNewPolicy(
        createRefundPolicyDto,
        existingPolicies,
      );

      if (!noOverlap) {
        throw new BadRequestException(
          "Refund policy conflicts with existing policies.",
        );
      }

      return await this.refundPolicyRepository.createRefundPolicy({
        ...refundPolicyData,
        refundSemester: { connect: { id: semesterId } },
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create refund policy: ${error.message}`,
      );
    }
  }

  async createMultipleRefundPolicies(
    createRefundPolicyDtos: CreateRefundPolicyDto[],
  ): Promise<number> {
    try {
      const formattedPolicies: Prisma.RefundPolicyCreateManyInput[] = [];

      for (const policyDto of createRefundPolicyDtos) {
        const { semesterId, ...refundPolicyData } = policyDto;

        const semester =
          await this.semesterRepository.getSemesterById(semesterId);
        if (!semester) {
          throw new NotFoundException(
            `Semester with ID ${semesterId} not found`,
          );
        }

        const existingPolicies =
          await this.refundPolicyRepository.getRefundPoliciesBySemester(
            semesterId,
          );

        const noOverlap = this.verifyNewPolicy(policyDto, existingPolicies);

        if (!noOverlap) {
          throw new BadRequestException(
            `Refund policy conflicts with existing policies. (Semester ID: ${semesterId})`,
          );
        }

        formattedPolicies.push({
          ...refundPolicyData,
          semesterId,
        });
      }

      const createdCount =
        await this.refundPolicyRepository.createRefundPolicies(
          formattedPolicies,
        );
      return createdCount;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to create multiple refund policies: ${error.message}`,
      );
    }
  }

  async getAllRefundPolicies(): Promise<RefundPolicyEntity[]> {
    try {
      return await this.refundPolicyRepository.getAllRefundPolicies();
    } catch (error) {
      throw new BadRequestException(
        `Failed to retrieve all refund policies: ${error.message}`,
      );
    }
  }

  async getRefundPolicyById(id: number): Promise<RefundPolicyEntity> {
    try {
      const refundPolicy =
        await this.refundPolicyRepository.getRefundPolicyById(id);
      if (!refundPolicy) {
        throw new NotFoundException(`Refund policy with ID ${id} not found`);
      }
      return refundPolicy;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve refund policy for id ${id}: ${error.message}`,
      );
    }
  }

  async getRefundPoliciesBySemester(
    year: number,
    season: Season,
  ): Promise<RefundPolicyEntity[]> {
    try {
      const semester = await this.semesterRepository.getSemesterByYearAndSeason(
        year,
        season,
      );
      if (!semester) {
        throw new NotFoundException(
          `Semester not found for year ${year}, season ${season}`,
        );
      }

      return await this.refundPolicyRepository.getRefundPoliciesBySemester(
        semester.id,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to retrieve refund policies for year ${year} and season ${season}: ${error.message}`,
      );
    }
  }

  async updateRefundPolicy(
    id: number,
    updateRefundPolicyDto: UpdateRefundPolicyDto,
  ): Promise<RefundPolicyEntity> {
    try {
      const refundPolicy =
        await this.refundPolicyRepository.getRefundPolicyById(id);
      if (!refundPolicy) {
        throw new NotFoundException(`Refund Policy with ID ${id} not found`);
      }

      const existingPolicies =
        await this.refundPolicyRepository.getRefundPoliciesBySemester(
          refundPolicy.semesterId,
        );

      const noOverlap = this.verifyNewPolicy(
        updateRefundPolicyDto,
        existingPolicies,
      );

      if (!noOverlap) {
        throw new BadRequestException(
          "Refund policy conflicts with existing policies.",
        );
      }

      return this.refundPolicyRepository.updateRefundPolicy(
        id,
        updateRefundPolicyDto,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to update refund policy: ${error.message}`,
      );
    }
  }

  async deleteRefundPolicy(id: number): Promise<RefundPolicyEntity> {
    try {
      if (!id || id <= 0) {
        throw new BadRequestException(`Invalid refund policy ID: ${id}`);
      }
      const refundPolicy =
        await this.refundPolicyRepository.getRefundPolicyById(id);
      if (!refundPolicy) {
        throw new NotFoundException(`Refund policy with ID ${id} not found`);
      }
      return await this.refundPolicyRepository.deleteRefundPolicy(id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException(
        `Failed to delete refund policy: ${error.message}`,
      );
    }
  }

  private verifyNewPolicy(
    newPolicy: CreateRefundPolicyDto | UpdateRefundPolicyDto,
    existingPolicies: RefundPolicyEntity[],
  ): boolean {
    if (newPolicy.minAttend > newPolicy.maxAttend) {
      return false;
    }

    const hasConflict = existingPolicies.some(
      (policy) =>
        policy.type === newPolicy.type &&
        ((newPolicy.minAttend >= policy.minAttend &&
          newPolicy.minAttend <= policy.maxAttend) ||
          (newPolicy.maxAttend >= policy.minAttend &&
            newPolicy.maxAttend <= policy.maxAttend) ||
          (newPolicy.minAttend <= policy.minAttend &&
            newPolicy.maxAttend >= policy.maxAttend)),
    );

    return !hasConflict;
  }

  async calculateTotalRefundAmount(
    attendances: { lectureDone: boolean; taskDone: boolean }[],
    lectureRefundPolicies: RefundPolicyEntity[],
    taskRefundPolicies: RefundPolicyEntity[],
  ): Promise<number> {
    let totalRefundAmount = 0;
    const lectureCount = attendances.filter((a) => a.lectureDone).length;
    const taskCount = attendances.filter((a) => a.taskDone).length;

    totalRefundAmount += this.calculateRefundForType(
      lectureCount,
      lectureRefundPolicies,
    );
    totalRefundAmount += this.calculateRefundForType(
      taskCount,
      taskRefundPolicies,
    );

    return totalRefundAmount;
  }

  private calculateRefundForType(
    attendCount: number,
    policies: RefundPolicyEntity[],
  ): number {
    for (const policy of policies) {
      if (attendCount >= policy.minAttend && attendCount <= policy.maxAttend) {
        return policy.refundAmount;
      }
    }
    return 0;
  }
}
