export interface School {
  id: number | string;
  name: string;
  city?: string;
  classIds?: (number | string)[];
}

export interface ClassEntity {
  id: number | string;
  name: string;
  schoolId?: number | string;
}
