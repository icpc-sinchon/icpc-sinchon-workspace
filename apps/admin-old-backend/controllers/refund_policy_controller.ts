import type { Request, Response } from "express";
import RefundPolicyRepository from "repositories/refund_policy_repository";
import type { Prisma } from "@prisma/client";
import type {
	EmptyObject,
	RefundPolicyInput,
	RefundPolicyVerification,
	SemesterIdentifier,
	SemesterQuery,
} from "types";
import RefundPolicyService from "services/refund_policy_service";

class RefundPolicyController {
	private static instance: RefundPolicyController;
	private refundPolicyService: RefundPolicyService;

	private constructor() {
		this.refundPolicyService = RefundPolicyService.getInstance();
	}

	public static getInstance(): RefundPolicyController {
		if (!RefundPolicyController.instance) {
			RefundPolicyController.instance = new RefundPolicyController();
		}
		return RefundPolicyController.instance;
	}

	public async getRefundPolicies(
		req: Request<EmptyObject, EmptyObject, EmptyObject, SemesterQuery>,
		res: Response,
	): Promise<void> {
		const { year, season } = req.query;
		if (!year || !season) {
			res.status(400).send("year, season query required");
			return;
		}

		try {
			const refundPolicies =
				await RefundPolicyRepository.findRefundPoliciesBySemester(
					Number.parseInt(year),
					season,
				);
			console.log(refundPolicies);
			res.json(refundPolicies);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async getRefundPolicyById(
		req: Request<{ id: string }>,
		res: Response,
	): Promise<void> {
		const refundPolicyId = Number.parseInt(req.params.id);
		if (Number.isNaN(refundPolicyId)) {
			res.status(400).send("id required");
			return;
		}
		try {
			const refundPolicy =
				await RefundPolicyRepository.findRefundPolicyById(refundPolicyId);
			console.log(refundPolicy);
			res.json(refundPolicy);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async createRefundPolicy(
		req: Request<EmptyObject, EmptyObject, RefundPolicyInput>,
		res: Response,
	): Promise<void> {
		try {
			const refundPolicy: RefundPolicyInput = req.body;
			const { year, season, ...refundPolicyData } = refundPolicy;
			console.log(refundPolicy);
			const createdPolicy = await this.refundPolicyService.createRefundPolicy(
				year,
				season,
				refundPolicyData,
			);
			if (createdPolicy === null) {
				res
					.status(400)
					.json({ error: "New policy overlaps with existing policies" });
			} else {
				res.status(201).json(createdPolicy);
			}
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async createMultipleRefundPolicies(
		req: Request<
			EmptyObject,
			EmptyObject,
			Prisma.RefundPolicyCreateManyInput[]
		>,
		res: Response,
	): Promise<void> {
		try {
			const refundPolicies = req.body;
			console.log(refundPolicies);
			await RefundPolicyRepository.createRefundPolicies(refundPolicies);
			res.status(200).send("add success");
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async updateRefundPolicy(
		req: Request<
			{ refundPolicyId: string },
			EmptyObject,
			SemesterQuery & RefundPolicyVerification
		>,
		res: Response,
	): Promise<void> {
		try {
			const refundPolicyId = Number.parseInt(req.params.refundPolicyId);
			const { year, season, ...refundPolicy } = req.body;
			console.log(refundPolicy);
			const updatePolicy = await this.refundPolicyService.updateRefundPolicy(
				refundPolicyId,
				Number.parseInt(year),
				season,
				refundPolicy,
			);
			if (updatePolicy === null) {
				res
					.status(400)
					.json({ error: "New policy overlaps with existing policies" });
			} else {
				res.status(200).json(updatePolicy);
			}
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}

	public async deleteRefundPolicy(
		req: Request<{ refundPolicyId: string }>,
		res: Response,
	): Promise<void> {
		try {
			const refundPolicyId = Number.parseInt(req.params.refundPolicyId);
			await RefundPolicyRepository.deleteRefundPolicy(refundPolicyId);
			res.status(200).send(`refund policy ${refundPolicyId} delete success`);
		} catch (err) {
			console.error(err);
			res
				.status(500)
				.send(err instanceof Error ? err.message : "Unknown error");
		}
	}
}

export default RefundPolicyController;
