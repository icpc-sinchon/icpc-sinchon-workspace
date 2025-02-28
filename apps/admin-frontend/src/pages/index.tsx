import { Flex, Text, Button } from "@radix-ui/themes";
import Head from "next/head";
import React from "react";
import Layout from "@/ui/Layout";
import { GetServerSideProps } from "next";

function Index() {
  return (
    <>
      <Head>
        <title> 출석 관리 | ICPC Admin</title>
      </Head>
      <Layout title="메인 페이지" description="메인 페이지입니다.">
        <Flex direction="column" gap="2">
          <Text>Hello</Text>
          <Button>신촌연합 출석 관리</Button>
        </Flex>
      </Layout>
    </>
  );
}

export default Index;

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/student",
      permanent: false, // 302 리다이렉트 (일시적)
    },
  };
};
