import { BASE_URL } from "@env";
import { http, HttpResponse } from "msw";

type School = {
  id: number;
  name: string;
  address: string;
  classIds: number[];
};

type ClassEntity = {
  id: number;
  name: string;
  schoolId: number;
  turno: "Manhã" | "Tarde" | "Noite";
  anoLetivo: 2025 | 2026 | 2027 | 2028;
};

const schools: School[] = [
  { id: 1, name: "Escola Alfa", address: "Rua A, 100 - São Paulo", classIds: [1, 2, 3] },
  { id: 2, name: "Escola Beta", address: "Av. B, 200 - Rio de Janeiro", classIds: [4, 5, 6] },
  { id: 3, name: "Escola Gama", address: "Rua C, 300 - Belo Horizonte", classIds: [7, 8] },
  { id: 4, name: "Escola Delta", address: "Rua D, 400 - Curitiba", classIds: [9, 10, 11] },
  { id: 5, name: "Escola Épsilon", address: "Av. E, 500 - Salvador", classIds: [12, 13] },
  { id: 6, name: "Escola Ômega", address: "Rua F, 600 - Porto Alegre", classIds: [14, 15] },
];

const classes: ClassEntity[] = [
  { id: 1, name: "Turma 1A", schoolId: 1, turno: "Manhã", anoLetivo: 2025 },
  { id: 2, name: "Turma 1B", schoolId: 1, turno: "Tarde", anoLetivo: 2025 },
  { id: 3, name: "Turma 1C", schoolId: 1, turno: "Noite", anoLetivo: 2026 },

  { id: 4, name: "Turma 2A", schoolId: 2, turno: "Manhã", anoLetivo: 2025 },
  { id: 5, name: "Turma 2B", schoolId: 2, turno: "Tarde", anoLetivo: 2026 },
  { id: 6, name: "Turma 2C", schoolId: 2, turno: "Noite", anoLetivo: 2027 },

  { id: 7, name: "Turma 3A", schoolId: 3, turno: "Manhã", anoLetivo: 2025 },
  { id: 8, name: "Turma 3B", schoolId: 3, turno: "Manhã", anoLetivo: 2026 },

  { id: 9, name: "Turma 4A", schoolId: 4, turno: "Tarde", anoLetivo: 2025 },
  { id: 10, name: "Turma 4B", schoolId: 4, turno: "Noite", anoLetivo: 2027 },
  { id: 11, name: "Turma 4C", schoolId: 4, turno: "Manhã", anoLetivo: 2028 },

  { id: 12, name: "Turma 5A", schoolId: 5, turno: "Tarde", anoLetivo: 2026 },
  { id: 13, name: "Turma 5B", schoolId: 5, turno: "Noite", anoLetivo: 2027 },

  { id: 14, name: "Turma 6A", schoolId: 6, turno: "Manhã", anoLetivo: 2025 },
  { id: 15, name: "Turma 6B", schoolId: 6, turno: "Tarde", anoLetivo: 2028 },
];

export const handlers = [
  http.get(`${BASE_URL}/schools`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.toLowerCase() ?? "";

    const filtered = q
      ? schools.filter((s) => s.name.toLowerCase().includes(q))
      : schools;

    return HttpResponse.json(filtered);
  }),

  http.post(`${BASE_URL}/schools`, async ({ request }) => {
    const body = (await request.json()) as { name: string; address?: string };

    const newSchool: School = {
      id: schools.length + 1,
      name: body.name,
      address: body.address ?? "",
      classIds: [],
    };

    schools.unshift(newSchool);
    return HttpResponse.json(newSchool, { status: 201 });
  }),

  http.get(`${BASE_URL}/classes`, ({ request }) => {
    const url = new URL(request.url);
    const q = url.searchParams.get("q")?.toLowerCase() ?? "";

    const filtered = q
      ? classes.filter((c) => c.name.toLowerCase().includes(q))
      : classes;

    return HttpResponse.json(filtered);
  }),

  http.post(`${BASE_URL}/classes`, async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      schoolId: number;
      turno: ClassEntity["turno"];
      anoLetivo: ClassEntity["anoLetivo"];
    };

    const newClass: ClassEntity = {
      id: classes.length + 1,
      name: body.name,
      schoolId: body.schoolId,
      turno: body.turno,
      anoLetivo: body.anoLetivo,
    };

    classes.unshift(newClass);

    const school = schools.find((s) => s.id === body.schoolId);
    if (school) {
      school.classIds.push(newClass.id);
    }

    return HttpResponse.json(newClass, { status: 201 });
  }),
];
