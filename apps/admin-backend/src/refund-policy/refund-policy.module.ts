import { Module } from "@nestjs/common";
import { PrismaModule } from "src/prisma/prisma.module";
import { SemesterRepository } from "@/semester/semester.repository";
import { RefundPolicyRepository } from "./refund-policy.repository";
import { RefundPolicyService } from "./refund-policy.service";
import { RefundPolicyController } from "./refund-policy.controller";

@Module({
  imports: [PrismaModule],
  providers: [RefundPolicyRepository, RefundPolicyService, SemesterRepository],
  controllers: [RefundPolicyController],
})
export class RefundPolicyModule {}
