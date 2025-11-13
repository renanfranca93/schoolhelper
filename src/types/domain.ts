export interface School {
  id: number | string;
  name: string;
  city?: string;
}

export interface ClassEntity {
  id: number | string;
  name: string;
  schoolId?: number | string;
  schoolName?: string;
}
