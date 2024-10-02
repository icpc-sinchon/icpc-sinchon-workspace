import { type ComponentType, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";

export function withAuth<P>(WrappedComponent: ComponentType<P>) {
  return function WithAuth(props: P) {
    const { isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (
        !isLoading &&
        !isAuthenticated &&
        !router.pathname.startsWith("/login")
      ) {
        router.push("/login", undefined, { shallow: true });
      }
    }, [isAuthenticated, isLoading, router]);

    if (!isAuthenticated) {
      return null; // 또는 로딩 컴포넌트를 반환할 수 있습니다.
    }

    return <WrappedComponent {...props} />;
  };
}
