// contexts/SemesterContext.js
import React, { createContext, useContext, useMemo } from "react";
import useSWR from "swr";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";
import { Semester } from "@/types/setting";

const initialState: Semester = {
  id: 0,
  year: 2024,
  season: "Summer",
};

type SemesterContextType = {
  currentSemester: Semester;
  isLoading: boolean;
  error: any;
  mutate: () => void;
};

const SemesterContext = createContext<SemesterContextType | null>(null);

const fetcher = async (): Promise<Semester> => {
  const response = await adminAPI.get(API_URL.CONFIG);
  return response.data.currentSemester;
};

export function SemesterProvider({ children }: { children: React.ReactNode }) {
  const {
    data: currentSemester,
    error,
    isLoading,
    mutate,
  } = useSWR<Semester>("current-semester", fetcher, {
    fallbackData: initialState,
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  const value = useMemo(
    () => ({
      currentSemester: currentSemester || initialState,
      isLoading,
      error,
      mutate,
    }),
    [currentSemester, isLoading, error, mutate],
  );

  return (
    <SemesterContext.Provider value={value}>
      {children}
    </SemesterContext.Provider>
  );
}

export function useSemester(): SemesterContextType {
  const context = useContext(SemesterContext);
  if (context === null) {
    throw new Error("useSemester must be used within a SemesterProvider");
  }
  return context;
}
