import { BASE_URL } from "@env";
import { http, HttpResponse } from "msw";

type School = {
  id: number;
  name: string;
  city: string;
  classIds: number[];
};

type ClassEntity = {
  id: number;
  name: string;
  schoolId: number;
};

const schools: School[] = [
  { id: 1, name: "Escola Alfa", city: "São Paulo", classIds: [1, 2, 3] },
  { id: 2, name: "Escola Beta", city: "Rio de Janeiro", classIds: [4, 5, 6] },
  { id: 3, name: "Escola Gama", city: "Belo Horizonte", classIds: [7, 8] },
  { id: 4, name: "Escola Delta", city: "Curitiba", classIds: [9, 10, 11] },
  { id: 5, name: "Escola Épsilon", city: "Salvador", classIds: [12, 13] },
  { id: 6, name: "Escola Ômega", city: "Porto Alegre", classIds: [14, 15] },
];

const classes: ClassEntity[] = [
  { id: 1, name: "Turma 1A", schoolId: 1 },
  { id: 2, name: "Turma 1B", schoolId: 1 },
  { id: 3, name: "Turma 1C", schoolId: 1 },

  { id: 4, name: "Turma 2A", schoolId: 2 },
  { id: 5, name: "Turma 2B", schoolId: 2 },
  { id: 6, name: "Turma 2C", schoolId: 2 },

  { id: 7, name: "Turma 3A", schoolId: 3 },
  { id: 8, name: "Turma 3B", schoolId: 3 },

  { id: 9, name: "Turma 4A", schoolId: 4 },
  { id: 10, name: "Turma 4B", schoolId: 4 },
  { id: 11, name: "Turma 4C", schoolId: 4 },

  { id: 12, name: "Turma 5A", schoolId: 5 },
  { id: 13, name: "Turma 5B", schoolId: 5 },

  { id: 14, name: "Turma 6A", schoolId: 6 },
  { id: 15, name: "Turma 6B", schoolId: 6 },
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
    const body = (await request.json()) as { name: string; city?: string };

    const newSchool: School = {
      id: schools.length + 1,
      name: body.name,
      city: body.city ?? "",
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
    };

    const newClass: ClassEntity = {
      id: classes.length + 1,
      name: body.name,
      schoolId: body.schoolId,
    };

    classes.unshift(newClass);

    const school = schools.find((s) => s.id === body.schoolId);
    if (school) {
      school.classIds.push(newClass.id);
    }

    return HttpResponse.json(newClass, { status: 201 });
  }),
];
