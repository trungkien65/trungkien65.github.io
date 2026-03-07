/**
 * Hooks / utilities for client (vanilla JS).
 * Use in Astro script or component islands.
 */

export { debounce } from "./debounce"
export { throttle } from "./throttle"
export {
  getLocalStorage,
  setLocalStorage,
  subscribeLocalStorage,
} from "./useLocalStorage"
export { useMediaQuery, getMediaQueryMatches } from "./useMediaQuery"
export { useOnClickOutside } from "./useOnClickOutside"
