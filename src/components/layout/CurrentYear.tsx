"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Årtalet läses i webbläsaren så att sidorna kan förrenderas statiskt
 * och ändå alltid visa innevarande år.
 */
export function CurrentYear() {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => null,
  );
  return <>{year}</>;
}
