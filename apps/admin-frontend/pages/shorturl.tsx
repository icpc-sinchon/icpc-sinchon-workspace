import Head from "next/head";
import Layout from "@/ui/Layout";
import { withAuth } from "@/components/withAuth";

function ShortURL() {
  return (
    <>
      <Head>
        <title> 단축 주소 관리 | ICPC Admin</title>
      </Head>
      <Layout title="링크 관리">
        <h1>링크 관리</h1>
      </Layout>
    </>
  );
}

export default withAuth(ShortURL);
