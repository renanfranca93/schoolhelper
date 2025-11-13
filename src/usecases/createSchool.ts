import { schoolRepository, type CreateSchoolInput } from "../repositories/schoolRepository";
import type { School } from "../types/domain";

export async function createSchool(data: CreateSchoolInput): Promise<School> {
  if (!data.name || !data.name.trim()) {
    throw new Error("School name is required");
  }

  return schoolRepository.create(data);
}
