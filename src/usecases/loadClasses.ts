import { classRepository } from "../repositories/classRepository";
import type { ClassEntity } from "../types/domain";

export async function loadClasses(search = ""): Promise<ClassEntity[]> {
  return classRepository.list(search);
}
