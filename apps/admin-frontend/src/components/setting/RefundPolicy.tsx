import React, { useCallback, useEffect, useState } from "react";

import { Button, Flex, Heading, Table, Text } from "@radix-ui/themes";
import { SettingTab } from "@/components/setting/SettingItem";

import FormSelect from "../Select";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";
import { useSemester } from "@/contexts/SemesterContext";
import FormInput from "../Input";

type RefundPolicyType = "LECTURE" | "TASK";

type RefundPolicy = {
  id: number;
  type: RefundPolicyType;
  minAttend: number;
  maxAttend: number;
  refundAmount: number;
  semesterId: number;
};

type RefundPolicyCreateInput = {
  type: RefundPolicyType;
  minAttend: number;
  maxAttend: number;
  refundAmount: number;
  semesterId: number;
};

function RefundPolicyTable({
  title,
  refundPolices,
  onDeleteRefundPolicy,
}: {
  title: string;
  refundPolices: RefundPolicy[];
  onDeleteRefundPolicy: (id: number) => void;
}) {
  return (
    <Flex direction="column" gap="0.5rem">
      <Heading size="4">{title}</Heading>
      <Table.Root size="1">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>환급정책 ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>최소 출석</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>최대 출석</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>환급 금액</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>삭제</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {refundPolices.map((refundPolicy) => (
            <Table.Row key={refundPolicy.id}>
              <Table.Cell>{refundPolicy.id}</Table.Cell>
              <Table.Cell>{refundPolicy.minAttend}</Table.Cell>
              <Table.Cell>{refundPolicy.maxAttend}</Table.Cell>
              <Table.Cell>{refundPolicy.refundAmount}</Table.Cell>
              <Table.Cell>
                <Button
                  size="1"
                  color="red"
                  onClick={() => onDeleteRefundPolicy(refundPolicy.id)}
                >
                  삭제
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
}

function RefundPolicySetting() {
  const { currentSemester } = useSemester();
  const [newRefundPolicy, setNewRefundPolicy] =
    useState<RefundPolicyCreateInput>({
      type: "LECTURE",
      minAttend: 0,
      maxAttend: 0,
      refundAmount: 0,
      semesterId: currentSemester.id,
    });
  const [refundPolices, setRefundPolices] = useState<RefundPolicy[]>([]);

  const fetchRefundPolices = useCallback(async () => {
    const { data } = await adminAPI.get(API_URL.REFUND.BASE, {
      params: {
        year: currentSemester.year,
        season: currentSemester.season,
      },
    });
    console.log(data);
    setRefundPolices(data);
  }, [currentSemester]);

  useEffect(() => {
    fetchRefundPolices();
  }, [fetchRefundPolices]);

  const handleAddRefundPolicy = async () => {
    const newRefundPolicyData: RefundPolicyCreateInput = {
      semesterId: currentSemester.id,
      ...newRefundPolicy,
    };
    console.log(newRefundPolicyData);
    await adminAPI.post(API_URL.REFUND.BASE, newRefundPolicyData);
    fetchRefundPolices();
  };

  const handleDeleteRefundPolicy = async (id: number) => {
    await adminAPI.delete(API_URL.REFUND.byId(id));
    setRefundPolices(
      refundPolices.filter((refundPolicy) => refundPolicy.id !== id),
    );
  };

  const formattedCurrentSemester = `${currentSemester.year}-${currentSemester.season}`;

  const lectureRefundPolices = refundPolices
    .filter((refundPolicy) => refundPolicy.type === "LECTURE")
    .sort((a, b) => a.minAttend - b.minAttend);
  const taskRefundPolices = refundPolices
    .filter((refundPolicy) => refundPolicy.type === "TASK")
    .sort((a, b) => a.minAttend - b.minAttend);

  return (
    <>
      <SettingTab
        tabTitle="환급 정책 추가"
        onSubmit={handleAddRefundPolicy}
        confirmMessage="환급 정책을 추가하시겠습니까?"
      >
        <Flex direction="column" gap="0.5rem">
          <Text as="label" weight="bold">
            현재 학기 : {formattedCurrentSemester}
          </Text>
          <FormSelect
            label="환급 정책 종류"
            name="refundPolicyType"
            defaultValue="LECTURE"
            value={newRefundPolicy.type}
            onValueChange={(value) =>
              setNewRefundPolicy({
                ...newRefundPolicy,
                type: value as RefundPolicyType,
              })
            }
            options={[
              { label: "강의", value: "LECTURE" },
              { label: "과제", value: "TASK" },
            ]}
          />
          <FormInput
            label="최소 출석"
            name="minAttend"
            type="number"
            value={newRefundPolicy.minAttend.toString()}
            onChange={(e) =>
              setNewRefundPolicy({
                ...newRefundPolicy,
                minAttend: Number(e.target.value),
              })
            }
          />
          <FormInput
            label="최대 출석"
            name="maxAttend"
            type="number"
            value={newRefundPolicy.maxAttend.toString()}
            onChange={(e) =>
              setNewRefundPolicy({
                ...newRefundPolicy,
                maxAttend: Number(e.target.value),
              })
            }
          />
          <FormInput
            label="환급 금액"
            name="refundAmount"
            type="number"
            value={newRefundPolicy.refundAmount.toString()}
            onChange={(e) =>
              setNewRefundPolicy({
                ...newRefundPolicy,
                refundAmount: Number(e.target.value),
              })
            }
          />
        </Flex>
      </SettingTab>
      <Heading size="5" weight="bold">
        현재 환급 정책
      </Heading>
      <RefundPolicyTable
        title="강의 환급 정책"
        refundPolices={lectureRefundPolices}
        onDeleteRefundPolicy={handleDeleteRefundPolicy}
      />
      <RefundPolicyTable
        title="과제 환급 정책"
        refundPolices={taskRefundPolices}
        onDeleteRefundPolicy={handleDeleteRefundPolicy}
      />
    </>
  );
}

export default RefundPolicySetting;
