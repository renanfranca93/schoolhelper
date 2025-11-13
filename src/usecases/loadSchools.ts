import { schoolRepository } from "../repositories/schoolRepository";
import type { School } from "../types/domain";

export async function loadSchools(search = ""): Promise<School[]> {
  return schoolRepository.list(search);
}
