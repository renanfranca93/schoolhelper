import { apiClient } from "../api/apiClient";
import type { School } from "../types/domain";

export interface CreateSchoolInput {
  name: string;
  city?: string;
}

export const schoolRepository = {
  list(search?: string): Promise<School[]> {
    const params = search ? { q: search } : undefined;
    return apiClient.get<School[]>("/schools", params);
  },

  create(data: CreateSchoolInput): Promise<School> {
    return apiClient.post<School, CreateSchoolInput>("/schools", data);
  },
};
