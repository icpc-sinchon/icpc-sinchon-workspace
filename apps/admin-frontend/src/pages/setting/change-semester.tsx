import React from "react";
import Head from "next/head";
import Layout from "@/ui/Layout";
import TabNavigation from "@/ui/TabNavigation";
import { routers } from ".";
import ChangeCurrentSemester from "@/components/setting/ChangeCurrentSemester";

function ChangeSemesterPage() {
  return (
    <>
      <Head>
        <title>현재 학기 변경 | ICPC Admin</title>
      </Head>
      <Layout title="설정 페이지">
        <TabNavigation items={routers} />
        <ChangeCurrentSemester />
      </Layout>
    </>
  );
}

export default ChangeSemesterPage;
