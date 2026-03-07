/**
 * Hooks / utilities cho client (vanilla JS).
 * Dùng trong script của Astro hoặc component islands.
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
