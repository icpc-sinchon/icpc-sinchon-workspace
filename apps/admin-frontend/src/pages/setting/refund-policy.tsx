import React from "react";
import Head from "next/head";
import Layout from "@/ui/Layout";
import TabNavigation from "@/ui/TabNavigation";
import { routers } from ".";
import RefundPolicySetting from "@/components/setting/RefundPolicy";

function AddAdminPage() {
  return (
    <>
      <Head>
        <title>학기 환급 정책 관리 | ICPC Admin</title>
      </Head>
      <Layout title="설정 페이지">
        <TabNavigation items={routers} />
        <RefundPolicySetting />
      </Layout>
    </>
  );
}

export default AddAdminPage;
