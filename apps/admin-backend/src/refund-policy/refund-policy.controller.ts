import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiQuery,
  ApiOperation,
} from "@nestjs/swagger";
import { Season } from "@prisma/client";
import { CreateRefundPolicyDto } from "./dto/create-refund-policy.dto";
import { UpdateRefundPolicyDto } from "./dto/update-refund-policy.dto";
import { RefundPolicyEntity } from "./entities/refund-policy.entity";
import { RefundPolicyService } from "./refund-policy.service";

@ApiTags("Refund Policy")
@Controller("refund-policy")
export class RefundPolicyController {
  constructor(private readonly refundPolicyService: RefundPolicyService) {}

  @Post()
  @ApiOperation({ summary: "새로운 환급 정책 생성" })
  @ApiCreatedResponse({
    type: RefundPolicyEntity,
    description: "새로운 환급 정책을 생성합니다.",
  })
  @ApiBadRequestResponse({
    description: "환급 정책 생성에 실패했습니다.",
  })
  async createRefundPolicy(
    @Body() createRefundPolicyDto: CreateRefundPolicyDto
  ): Promise<RefundPolicyEntity> {
    console.log("createRefundPolicyDto", createRefundPolicyDto);
    return this.refundPolicyService.createRefundPolicy(createRefundPolicyDto);
  }

  @Post("/multiple")
  @ApiOperation({ summary: "새로운 여러 환급 정책 생성" })
  @ApiCreatedResponse({
    type: RefundPolicyEntity,
    description: "새로운 여러 환급 정책을 생성합니다.",
  })
  @ApiBadRequestResponse({
    description: "환급 정책 생성에 실패했습니다.",
  })
  async createMultipleRefundPolicies(
    @Body() createRefundPolicyDto: CreateRefundPolicyDto[]
  ): Promise<number> {
    return this.refundPolicyService.createMultipleRefundPolicies(
      createRefundPolicyDto
    );
  }

  @Get()
  @ApiOperation({ summary: "특정 학기의 환급 정책 조회" })
  @ApiQuery({
    name: "year",
    type: Number,
    description: "조회할 환급 정책이 속한 학기의 연도입니다.",
  })
  @ApiQuery({
    name: "season",
    enum: Season,
    description:
      "조회할 환급 정책이 속한 학기의 시즌(예: Summer, Winter)입니다.",
  })
  @ApiOkResponse({
    type: [RefundPolicyEntity],
    description: "특정 학기의 모든 환급 정책을 반환합니다.",
  })
  @ApiBadRequestResponse({
    description: "환급 정책을 조회하는 데 실패했습니다.",
  })
  async getRefundPoliciesBySemester(
    @Query("year", ParseIntPipe) year: number,
    @Query("season") season: Season
  ): Promise<RefundPolicyEntity[]> {
    return this.refundPolicyService.getRefundPoliciesBySemester(year, season);
  }

  @Get(":id")
  @ApiOperation({ summary: "특정 환급 정책 조회" })
  @ApiOkResponse({
    type: RefundPolicyEntity,
    description: "특정 ID를 가진 환급 정책을 반환합니다.",
  })
  @ApiNotFoundResponse({
    description: "환급 정책을 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "환급 정책을 조회하는 데 실패했습니다.",
  })
  async getRefundPolicyById(
    @Param("id", ParseIntPipe) id: number
  ): Promise<RefundPolicyEntity> {
    return this.refundPolicyService.getRefundPolicyById(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "특정 환급 정책 수정" })
  @ApiOkResponse({
    type: RefundPolicyEntity,
    description: "특정 ID를 가진 환급 정책을 업데이트합니다.",
  })
  @ApiNotFoundResponse({
    description: "업데이트하려는 환급 정책을 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "환급 정책 업데이트에 실패했습니다.",
  })
  async updateRefundPolicy(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateRefundPolicyDto: UpdateRefundPolicyDto
  ): Promise<RefundPolicyEntity> {
    return this.refundPolicyService.updateRefundPolicy(
      id,
      updateRefundPolicyDto
    );
  }

  @Delete(":id")
  @ApiOperation({ summary: "특정 환급 정책 삭제" })
  @ApiOkResponse({
    type: RefundPolicyEntity,
    description: "특정 ID를 가진 환급 정책을 삭제합니다.",
  })
  @ApiNotFoundResponse({
    description: "삭제하려는 환급 정책을 찾을 수 없습니다.",
  })
  @ApiBadRequestResponse({
    description: "환급 정책 삭제에 실패했습니다.",
  })
  async deleteRefundPolicy(
    @Param("id", ParseIntPipe) id: number
  ): Promise<RefundPolicyEntity> {
    return this.refundPolicyService.deleteRefundPolicy(id);
  }
}
