// contexts/SemesterContext.js
import type React from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { adminAPI } from "@/utils/api";
import { API_URL } from "@/types/apis";
import type { Semester } from "@/types/setting";

const initialState: Semester = {
  id: 1,
  year: 2024,
  season: "Summer",
};

type SemesterContextType = {
  currentSemester: Semester;
  isLoading: boolean;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  error: any;
};

const SemesterContext = createContext<SemesterContextType | null>(null);

const fetchSemester = async (): Promise<Semester> => {
  const response = await adminAPI.get(API_URL.CONFIG);
  return response.data.currentSemester;
};

export function SemesterProvider({ children }: { children: React.ReactNode }) {
  const [currentSemester, setCurrentSemester] =
    useState<Semester>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const refreshSemester = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const semester = await fetchSemester();
      setCurrentSemester(semester);
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load initial semester data
  useEffect(() => {
    refreshSemester();
  }, [refreshSemester]);

  const value = useMemo(
    () => ({
      currentSemester,
      isLoading,
      error,
    }),
    [currentSemester, isLoading, error],
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
