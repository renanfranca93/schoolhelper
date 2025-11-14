import React, {
  createContext,
  useContext,
  useEffect,
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
  classesList: ClassEntity[];

  fetchSchools: (search?: string) => Promise<void>;
  fetchClasses: (search?: string) => Promise<void>;

  addSchool: (data: { name: string; address?: string }) => Promise<void>;
  addClass: (data: {
    name: string;
    schoolId: number | string;
    turno: ClassEntity["turno"];
    anoLetivo: ClassEntity["anoLetivo"];
  }) => Promise<void>;

  updateSchool: (
    id: number | string,
    updates: { name?: string; address?: string }
  ) => void;
  deleteSchool: (id: number | string) => void;

  updateClass: (
    id: number | string,
    updates: {
      name?: string;
      schoolId?: number | string;
      turno?: ClassEntity["turno"];
      anoLetivo?: ClassEntity["anoLetivo"];
    }
  ) => void;
  deleteClass: (id: number | string) => void;
}

const AppDataContext = createContext<AppDataContextValue | undefined>(
  undefined
);

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [schools, setSchools] = useState<School[]>([]);
  const [classesList, setClassesList] = useState<ClassEntity[]>([]);

  useEffect(() => {
    fetchSchools();
    fetchClasses();
  }, []);

  const fetchSchools = async (search?: string) => {
    const data = await loadSchools(search ?? "");
    setSchools(
      data.map((s) => ({
        ...s,
        classIds: s.classIds ?? [],
      }))
    );
  };

  const fetchClasses = async (search?: string) => {
    const data = await loadClasses(search ?? "");
    setClassesList(data);
  };

  const addSchool = async (payload: { name: string; address?: string }) => {
    const created = await createSchool(payload);
    const schoolWithClassIds: School = {
      ...created,
      classIds: created.classIds ?? [],
    };
    setSchools((prev) => [schoolWithClassIds, ...prev]);
  };

  const addClass = async (payload: {
    name: string;
    schoolId: number | string;
    turno: ClassEntity["turno"];
    anoLetivo: ClassEntity["anoLetivo"];
  }) => {
    const created = await createClass(payload);

    setClassesList((prev) => [created, ...prev]);

    setSchools((prev) =>
      prev.map((s) =>
        String(s.id) === String(created.schoolId)
          ? {
              ...s,
              classIds: [...(s.classIds ?? []), created.id],
            }
          : s
      )
    );
  };

  const updateSchool = (
    id: number | string,
    updates: { name?: string; address?: string }
  ) => {
    setSchools((prev) =>
      prev.map((s) => (String(s.id) === String(id) ? { ...s, ...updates } : s))
    );
  };

  const updateClass = (
    id: number | string,
    updates: {
      name?: string;
      schoolId?: number | string;
      turno?: ClassEntity["turno"];
      anoLetivo?: ClassEntity["anoLetivo"];
    }
  ) => {
    setClassesList((prev) =>
      prev.map((c) => (String(c.id) === String(id) ? { ...c, ...updates } : c))
    );

    if (updates.schoolId !== undefined) {
      setSchools((prev) =>
        prev.map((s) => {
          let classIds = s.classIds ?? [];
          const has = classIds.some((cid) => String(cid) === String(id));

          if (has && String(s.id) !== String(updates.schoolId)) {
            classIds = classIds.filter((cid) => String(cid) !== String(id));
          }

          if (
            String(s.id) === String(updates.schoolId) &&
            !classIds.some((cid) => String(cid) === String(id))
          ) {
            classIds = [...classIds, Number(id)];
          }

          return { ...s, classIds };
        })
      );
    }
  };

  const deleteSchool = (id: number | string) => {
    setSchools((prev) => prev.filter((s) => String(s.id) !== String(id)));
    setClassesList((prev) =>
      prev.filter((c) => String(c.schoolId) !== String(id))
    );
  };

  const deleteClass = (id: number | string) => {
    setClassesList((prev) => prev.filter((c) => String(c.id) !== String(id)));

    setSchools((prev) =>
      prev.map((s) => ({
        ...s,
        classIds: (s.classIds ?? []).filter(
          (cid) => String(cid) !== String(id)
        ),
      }))
    );
  };

  const value: AppDataContextValue = {
    schools,
    classesList,
    fetchSchools,
    fetchClasses,
    addSchool,
    addClass,
    updateSchool,
    deleteSchool,
    updateClass,
    deleteClass,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData(): AppDataContextValue {
  const ctx = useContext(AppDataContext);
  if (!ctx) throw new Error("useAppData must be used inside AppDataProvider");
  return ctx;
}
