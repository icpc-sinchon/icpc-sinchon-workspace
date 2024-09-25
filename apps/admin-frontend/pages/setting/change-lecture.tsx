import React from "react";
import Head from "next/head";
import Layout from "@/ui/Layout";
import TabNavigation from "@/ui/TabNavigation";
import { routers } from ".";
import ChangeSemesterLecture from "@/components/setting/ChangeSemesterLecture";
import { withAuth } from "@/components/withAuth";

function ChangeLecturePage() {
  return (
    <>
      <Head>
        <title>강의 정보 변경 | ICPC Admin</title>
      </Head>
      <Layout title="설정 페이지">
        <TabNavigation items={routers} />
        <ChangeSemesterLecture />
      </Layout>
    </>
  );
}

export default withAuth(ChangeLecturePage);
