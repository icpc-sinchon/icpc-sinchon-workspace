import type { Prisma, PrismaClient, Semester } from "@prisma/client";
import BaseRepository from "./base_repository";

export default class RefundPolicyRepository extends BaseRepository {
	static instance: PrismaClient;

	static async createRefundPolicy(
		semesterId: number,
		refundPolicyData: Omit<Prisma.RefundPolicyCreateInput, "refundSemester">,
	) {
		return RefundPolicyRepository.instance.refundPolicy.create({
			data: {
				...refundPolicyData,
				refundSemester: { connect: { id: semesterId } },
			},
		});
	}

	static async createRefundPolicies(
		refundPolicyData: Prisma.RefundPolicyCreateManyInput[],
	) {
		return RefundPolicyRepository.instance.refundPolicy.createMany({
			data: refundPolicyData,
			skipDuplicates: true,
		});
	}

	static async updateRefundPolicy(
		refundPolicyId: number,
		newRefundPolicyData: Prisma.RefundPolicyUpdateInput,
	) {
		return RefundPolicyRepository.instance.refundPolicy.update({
			where: { id: refundPolicyId },
			data: newRefundPolicyData,
		});
	}

	static async deleteRefundPolicy(refundPolicyId: number) {
		return RefundPolicyRepository.instance.refundPolicy.delete({
			where: { id: refundPolicyId },
		});
	}

	static async findRefundPolicyById(refundPolicyId: number) {
		return RefundPolicyRepository.instance.refundPolicy.findUnique({
			where: { id: refundPolicyId },
		});
	}

	static async findRefundPoliciesBySemester(
		year: number,
		season: Semester["season"],
	) {
		return RefundPolicyRepository.instance.refundPolicy.findMany({
			where: {
				refundSemester: {
					year: year,
					season: season,
				},
			},
		});
	}

	static async findRefundPoliciesBySemesterId(semesterId: number) {
		const refundPolicies =
			await RefundPolicyRepository.instance.refundPolicy.findMany({
				where: { semesterId: semesterId },
			});
		return refundPolicies;
	}

	static async allRefundPolicies() {
		return RefundPolicyRepository.instance.refundPolicy.findMany();
	}

	static async reset() {
		return RefundPolicyRepository.instance.refundPolicy.deleteMany();
	}
}
