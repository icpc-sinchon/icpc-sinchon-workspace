import styled from "styled-components";
import {
  Heading,
  Button,
  Flex,
  Text,
  Select,
  Separator,
  Card,
} from "@radix-ui/themes";
import { useRouter } from "next/router";

import { useSemester } from "@/contexts/SemesterContext";

type StudentPageControlProps = {
  children?: React.ReactNode;
};

function PageControlLayout({ children }: StudentPageControlProps) {
  const router = useRouter();
  const { currentSemester } = useSemester();

  return (
    <Card my="2">
      <Flex direction="row" align="center" gap="4" pb="2">
        <Heading as="h2" size="4">
          현재 시즌 : {currentSemester.year} {currentSemester.season}
        </Heading>
        <Button
          size="2"
          onClick={() => router.push("/setting/change-semester")}
        >
          시즌 변경
        </Button>
      </Flex>
      <Separator mb="2" size="4" />
      {children}
    </Card>
  );
}

export default PageControlLayout;
