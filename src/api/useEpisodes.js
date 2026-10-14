import { endpoints } from "./endpoints";
import { useFetch } from "./useFetch";

export function useEpisodes(page = 1, searchQuery = "") {
  const params = new URLSearchParams({ page: String(page) });
  const name = searchQuery.trim();

  if (name) {
    params.set("name", name);
  }

  return useFetch(`${endpoints.episodes}?${params.toString()}`);
}
