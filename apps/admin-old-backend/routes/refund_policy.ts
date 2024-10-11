import express, { type Request } from "express";
import RefundPolicyController from "controllers/refund_policy_controller";
import type { EmptyObject, SemesterQuery } from "types";
import { loginRequired } from "utils/jwt";

const refundPolicyRouter = express.Router();
const refundPolicyController = RefundPolicyController.getInstance();

refundPolicyRouter.use(express.json());
refundPolicyRouter.use(express.urlencoded({ extended: false }));

// 환급 정책 가져오기 (with year, season query)
refundPolicyRouter.get(
	"/",
	loginRequired,
	(req: Request<EmptyObject, EmptyObject, EmptyObject, SemesterQuery>, res) => {
		refundPolicyController.getRefundPolicies(req, res);
	},
);

refundPolicyRouter.get<"/:id">("/:id", loginRequired, (req, res) => {
	refundPolicyController.getRefundPolicyById(req, res);
});

// 환급 정책 생성
refundPolicyRouter.post<"/">("/", loginRequired, (req, res) => {
	refundPolicyController.createRefundPolicy(req, res);
});

// 환급 정책 여러 개 생성
refundPolicyRouter.post<"/multiple">("/multiple", loginRequired, (req, res) => {
	refundPolicyController.createMultipleRefundPolicies(req, res);
});

// refundPolicyId의 환급 정책 수정
refundPolicyRouter.patch<"/:refundPolicyId">(
	"/:refundPolicyId",
	loginRequired,
	(req, res) => {
		refundPolicyController.updateRefundPolicy(req, res);
	},
);

// refundPolicyId의 환급 정책 삭제
refundPolicyRouter.delete<"/:refundPolicyId">(
	"/:refundPolicyId",
	loginRequired,
	(req, res) => {
		refundPolicyController.deleteRefundPolicy(req, res);
	},
);

export default refundPolicyRouter;
