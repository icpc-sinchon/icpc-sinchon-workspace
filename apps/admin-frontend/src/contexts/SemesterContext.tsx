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
import type { Lecture, Semester } from "@/types/setting";

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

export const useLectures = (semester: Semester | null) => {
  const [lectures, setLectures] = useState<Lecture[] | null>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchLectures = useCallback(async () => {
    if (!semester) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await adminAPI.get<Lecture[]>(API_URL.LECTURE.BASE, {
        params: { year: semester.year, season: semester.season },
      });
      setLectures(response.data);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [semester]);

  useEffect(() => {
    fetchLectures();
  }, [fetchLectures]);

  return { lectures, isLoading, error, refreshLectures: fetchLectures };
};
