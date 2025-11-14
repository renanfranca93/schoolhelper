export interface School {
  id: number | string;
  name: string;
  address?: string;
  classIds?: (number | string)[];
}

export type Turno = "Manhã" | "Tarde" | "Noite";

export type AnoLetivo = 2025 | 2026 | 2027 | 2028;

export interface ClassEntity {
  id: number | string;
  name: string;
  schoolId: number | string;
  turno: Turno;
  anoLetivo: AnoLetivo;
}
