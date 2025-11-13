import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import type { ClassEntity, School } from "../types/domain";
import { createClass } from "../usecases/createClass";
import { createSchool } from "../usecases/createSchool";
import { loadClasses } from "../usecases/loadClasses";
import { loadSchools } from "../usecases/loadSchools";

interface AppDataContextValue {
  schools: School[];
  fetchSchools: (search?: string) => Promise<void>;
  addSchool: (data: { name: string; city?: string }) => Promise<void>;

  classesList: ClassEntity[];
  fetchClasses: (search?: string) => Promise<void>;
  addClass: (data: {
    name: string;
    schoolId?: string | number;
  }) => Promise<void>;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(
  undefined
);

interface AppDataProviderProps {
  children: ReactNode;
}

export function AppDataProvider({ children }: AppDataProviderProps) {
  const [schools, setSchools] = useState<School[]>([]);
  const [classesList, setClassesList] = useState<ClassEntity[]>([]);

  const fetchSchools = async (search?: string) => {
    const data = await loadSchools(search ?? "");
    setSchools(data);
  };

  const addSchool = async (payload: { name: string; city?: string }) => {
    const created = await createSchool(payload);
    setSchools((prev) => [created, ...prev]);
  };

  const fetchClasses = async (search?: string) => {
    const data = await loadClasses(search ?? "");
    setClassesList(data);
  };

  const addClass = async (payload: {
    name: string;
    schoolId?: string | number;
  }) => {
    const created = await createClass(payload);
    setClassesList((prev) => [created, ...prev]);
  };

  const value: AppDataContextValue = {
    schools,
    fetchSchools,
    addSchool,
    classesList,
    fetchClasses,
    addClass,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) {
    throw new Error("useAppData must be used inside AppDataProvider");
  }
  return ctx;
}
