import { endpoints } from "./endpoints";
import { useFetch } from "./useFetch";

export function useCharacters(page = 1, searchQuery = "", filters = {}) {
  const params = new URLSearchParams({ page: String(page) });
  const name = searchQuery.trim();

  if (name) {
    params.set("name", name);
  }

  for (const key of ["status", "species", "gender"]) {
    if (filters[key]) params.set(key, filters[key]);
  }

  return useFetch(`${endpoints.characters}?${params.toString()}`);
}
