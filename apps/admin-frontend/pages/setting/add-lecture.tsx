import React from "react";
import Head from "next/head";
import Layout from "@/ui/Layout";
import TabNavigation from "@/ui/TabNavigation";
import { routers } from ".";
import AddLecture from "@/components/setting/AddLecture";
import { withAuth } from "@/components/withAuth";

function AddLecturePage() {
  return (
    <>
      <Head>
        <title>강의 추가 | ICPC Admin</title>
      </Head>
      <Layout title="설정 페이지">
        <TabNavigation items={routers} />
        <AddLecture />
      </Layout>
    </>
  );
}

export default withAuth(AddLecturePage);
