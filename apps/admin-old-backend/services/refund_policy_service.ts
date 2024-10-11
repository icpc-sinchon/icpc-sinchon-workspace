import type { RefundPolicy, Prisma, Semester } from "@prisma/client";
import RefundPolicyRepository from "repositories/refund_policy_repository";
import SemesterRepository from "repositories/semester_repository";
import type { RefundPolicyVerification } from "types";

export default class RefundPolicyService {
	private static instance: RefundPolicyService;
	private refundPolicyRepository: typeof RefundPolicyRepository;

	private constructor() {
		this.refundPolicyRepository = RefundPolicyRepository;
	}

	public static getInstance(): RefundPolicyService {
		if (!RefundPolicyService.instance) {
			RefundPolicyService.instance = new RefundPolicyService();
		}
		return RefundPolicyService.instance;
	}

	/**
	 * Checks if a new policy overlaps with existing policies
	 *
	 * @param newPolicy - The new policy to check
	 * @param existingPolicies - Array of existing policies
	 * @returns 만약 새로운 정책이 기존 정책과 겹치거나 문제가 있으면 false, 문제없으면 true
	 */
	private verifyNewPolicy(
		newPolicy: RefundPolicyVerification,
		existingPolicies: RefundPolicy[],
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

	/**
	 * Creates a new refund policy
	 */
	// TODO: 구간이 겹치는 refund policy가 있는지 확인하는 로직 추가
	async createRefundPolicy(
		year: number,
		season: Semester["season"],
		refundPolicyData: Omit<Prisma.RefundPolicyCreateInput, "refundSemester">,
	): Promise<RefundPolicy | null> {
		const semester = await SemesterRepository.findSemesterBySeason({
			year,
			season,
		});
		if (!semester) {
			throw new Error(`Semester not found for ${year} ${season}`);
		}

		const existingPolicies = await this.findRefundPoliciesBySemesterId(
			semester.id,
		);

		const noOverlap = this.verifyNewPolicy(refundPolicyData, existingPolicies);

		if (!noOverlap) {
			return null; // Return null if there's an overlap
		}

		return this.refundPolicyRepository.createRefundPolicy(
			semester.id,
			refundPolicyData,
		);
	}

	/**
	 * Creates multiple new refund policies
	 *
	 * @param refundPolicyData - Array of properties to create multiple refund policies
	 * @returns A promise that resolves to the creation result
	 */
	async createRefundPolicies(
		refundPolicyData: Prisma.RefundPolicyCreateManyInput[],
	): Promise<Prisma.BatchPayload> {
		return this.refundPolicyRepository.createRefundPolicies(refundPolicyData);
	}

	/**
	 * Updates a refund policy by id
	 */
	async updateRefundPolicy(
		id: number,
		year: number,
		season: Semester["season"],
		refundPolicyUpdateData: RefundPolicyVerification,
	): Promise<RefundPolicy | null> {
		const semester = await SemesterRepository.findSemesterBySeason({
			year,
			season,
		});
		if (!semester) {
			throw new Error(`Semester not found for ${year} ${season}`);
		}

		const existingPolicies = await this.findRefundPoliciesBySemesterId(
			semester.id,
		);

		const noOverlap = this.verifyNewPolicy(
			refundPolicyUpdateData,
			existingPolicies,
		);

		if (!noOverlap) {
			return null; // Return null if there's an overlap
		}

		return this.refundPolicyRepository.updateRefundPolicy(
			id,
			refundPolicyUpdateData,
		);
	}

	/**
	 * Deletes a refund policy by id
	 *
	 * @param id - The id of the refund policy to delete
	 * @returns A promise that resolves to the deleted RefundPolicy
	 */
	async deleteRefundPolicy(id: number): Promise<RefundPolicy> {
		return this.refundPolicyRepository.deleteRefundPolicy(id);
	}

	/**
	 * Finds a refund policy by id
	 *
	 * @param id - The id of the refund policy to find
	 * @returns A promise that resolves to the found RefundPolicy or null
	 */
	async findRefundPolicyById(id: number): Promise<RefundPolicy | null> {
		return this.refundPolicyRepository.findRefundPolicyById(id);
	}

	/**
	 * Finds refund policies by semester id
	 *
	 * @param semesterId - The id of the semester
	 * @returns A promise that resolves to an array of RefundPolicies
	 */
	async findRefundPoliciesBySemesterId(
		semesterId: number,
	): Promise<RefundPolicy[]> {
		return this.refundPolicyRepository.findRefundPoliciesBySemesterId(
			semesterId,
		);
	}

	/**
	 * Find all refund policies
	 *
	 * @returns A promise that resolves to an array of all RefundPolicies
	 */
	async getAllRefundPolicies(): Promise<RefundPolicy[]> {
		return this.refundPolicyRepository.allRefundPolicies();
	}

	/**
	 * Calculates refund amount for a specific type (lecture or task)
	 *
	 * @param attendCount - Number of completed items (lectures or tasks)
	 * @param policies - Array of refund policies
	 * @returns The refund amount for the specific type
	 */
	private calculateRefundForType(
		attendCount: number,
		policies: RefundPolicy[],
	): number {
		for (const policy of policies) {
			if (attendCount >= policy.minAttend && attendCount <= policy.maxAttend) {
				return policy.refundAmount;
			}
		}
		return 0;
	}

	/**
	 * Calculates the total refund amount based on attendances and refund policies
	 *
	 * @param attendances - Array of attendance records
	 * @param lectureRefundPolicies - Array of lecture refund policies
	 * @param taskRefundPolicies - Array of task refund policies
	 * @returns The total refund amount
	 */
	async calculateTotalRefundAmount(
		attendances: { lectureDone: boolean; taskDone: boolean }[],
		lectureRefundPolicies: RefundPolicy[],
		taskRefundPolicies: RefundPolicy[],
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
}
