import { Flex, Text, Button } from "@radix-ui/themes";
import Head from "next/head";
import React from "react";
import Layout from "@/ui/Layout";

function Index() {
  return (
    <>
      <Head>
        <title> 출석 관리 | ICPC Admin</title>
      </Head>
      <Layout title="메인 페이지" description="메인 페이지입니다.">
        <Flex direction="column" gap="2">
          <Text>Hello</Text>
          <Button>Let&apos;s go</Button>
        </Flex>
      </Layout>
    </>
  );
}

export default Index;
