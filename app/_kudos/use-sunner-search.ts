"use client";

import { useCallback, useMemo, useState } from "react";
import { SPOTLIGHT_NODES } from "./kudos-data";
import { SEARCH_MAX, matchesName } from "./kudos-board-helpers";

/**
 * The board's two Sunner-name searches (spec A.1 hero pill + spec B.7.3
 * Spotlight pill). They are one concern: the hero field validates a query and
 * hands it to the Spotlight cloud, which is the only surface on this screen
 * that carries Sunner names — so submitting also scrolls the cloud into view.
 *
 * Validation follows spec B.7.3: required, and never longer than 100 characters.
 */
export function useSunnerSearch() {
  const [heroQuery, setHeroQuery] = useState("");
  const [spotlightQuery, setSpotlightQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const nodes = useMemo(() => {
    const needle = spotlightQuery.trim();
    return needle
      ? SPOTLIGHT_NODES.filter((node) => matchesName(node.name, needle))
      : SPOTLIGHT_NODES;
  }, [spotlightQuery]);

  const onHeroQueryChange = useCallback((value: string) => {
    setHeroQuery(value);
    setError(value.length > SEARCH_MAX ? "search.tooLong" : null);
  }, []);

  const onHeroSubmit = useCallback(() => {
    if (!heroQuery.trim()) {
      setError("search.required");
      return;
    }
    if (heroQuery.length > SEARCH_MAX) {
      setError("search.tooLong");
      return;
    }
    setError(null);
    setSpotlightQuery(heroQuery.trim());
    document.getElementById("spotlight-board")?.scrollIntoView({ behavior: "smooth" });
  }, [heroQuery]);

  const onSpotlightQueryChange = useCallback((value: string) => {
    if (value.length > SEARCH_MAX) return;
    setSpotlightQuery(value);
  }, []);

  return {
    hero: { query: heroQuery, error, onQueryChange: onHeroQueryChange, onSubmit: onHeroSubmit },
    spotlight: { nodes, query: spotlightQuery, onQueryChange: onSpotlightQueryChange },
  };
}
