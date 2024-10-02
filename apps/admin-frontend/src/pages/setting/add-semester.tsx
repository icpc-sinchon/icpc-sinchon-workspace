import React from "react";
import Head from "next/head";
import Layout from "@/ui/Layout";
import AddSemester from "@/components/setting/AddSemester";
import TabNavigation from "@/ui/TabNavigation";
import { routers } from ".";
import { withAuth } from "@/components/withAuth";

function AddSemesterPage() {
  return (
    <>
      <Head>
        <title>학기 추가 | ICPC Admin</title>
      </Head>
      <Layout title="설정 페이지">
        <TabNavigation items={routers} />
        <AddSemester />
      </Layout>
    </>
  );
}

export default withAuth(AddSemesterPage);
