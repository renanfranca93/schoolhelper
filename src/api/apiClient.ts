import { BASE_URL } from "@env";

export const apiClient = {
  async get<T>(path: string, params?: Record<string, string | number>): Promise<T> {
    const url = new URL(BASE_URL + path);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`GET ${path} failed (${response.status})`);
    }

    return response.json() as Promise<T>;
  },

  async post<T>(path: string, body: unknown): Promise<T> {
    const response = await fetch(BASE_URL + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`POST ${path} failed (${response.status})`);
    }

    return response.json() as Promise<T>;
  },
};
