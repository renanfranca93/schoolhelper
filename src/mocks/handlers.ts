import { BASE_URL } from "@env";
import { http, HttpResponse } from "msw";

const schools = [
  { id: 1, name: "Escola Alfa", city: "São Paulo" },
  { id: 2, name: "Escola Beta", city: "Rio de Janeiro" },
];

const classes = [
  { id: 1, name: "Turma 1A", schoolId: 1, schoolName: "Escola Alfa" },
  { id: 2, name: "Turma 2B", schoolId: 2, schoolName: "Escola Beta" },
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
    const newSchool = {
      id: schools.length + 1,
      name: body.name,
      city: body.city ?? "",
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
      schoolId?: number | string;
    };

    const newClass = {
      id: classes.length + 1,
      name: body.name,
      schoolId: body.schoolId ?? null,
      schoolName: "Escola vinculada",
    };

    classes.unshift(newClass);
    return HttpResponse.json(newClass, { status: 201 });
  }),
];
