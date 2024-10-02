import React from "react";
import Head from "next/head";
import Layout from "@/ui/Layout";
import TabNavigation from "@/ui/TabNavigation";
import { routers } from ".";
import AddNewAdmin from "@/components/setting/AddAdmin";
import { withAuth } from "@/components/withAuth";

function AddAdminPage() {
  return (
    <>
      <Head>
        <title>관리자 계정 추가 | ICPC Admin</title>
      </Head>
      <Layout title="설정 페이지">
        <TabNavigation items={routers} />
        <AddNewAdmin />
      </Layout>
    </>
  );
}

export default withAuth(AddAdminPage);
