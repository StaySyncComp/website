import { createContext, useContext } from "react";

export const NestedOverlayContainerContext =
  createContext<HTMLElement | null>(null);

export function useNestedOverlayContainer() {
  return useContext(NestedOverlayContainerContext);
}
