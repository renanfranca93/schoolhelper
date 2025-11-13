import { classRepository, type CreateClassInput } from "../repositories/classRepository";
import type { ClassEntity } from "../types/domain";

export async function createClass(
  data: CreateClassInput
): Promise<ClassEntity> {
  if (!data.name || !data.name.trim()) {
    throw new Error("Class name is required");
  }

  return classRepository.create(data);
}
