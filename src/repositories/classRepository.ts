import { apiClient } from "../api/apiClient";
import type { ClassEntity } from "../types/domain";

export interface CreateClassInput {
  name: string;
  schoolId?: number | string;
}

export const classRepository = {
  list(search?: string): Promise<ClassEntity[]> {
    const params = search ? { q: search } : undefined;
    return apiClient.get<ClassEntity[]>("/classes", params);
  },

  create(data: CreateClassInput): Promise<ClassEntity> {
    return apiClient.post<ClassEntity, CreateClassInput>("/classes", data);
  },
};
