/**
 * Ball physics: radius mapping, collision, gravity constants.
 * Game state is separate from UI.
 */

export const GRAVITY = 0.6
export const BOARD_WIDTH = 420
export const BOARD_HEIGHT = 520
export const FLOOR_Y = BOARD_HEIGHT

/** Clamp ball center (x, y) so ball edge stays inside board. */
export function clampBallInBoard(
  x: number,
  y: number,
  radius: number
): { x: number; y: number } {
  return {
    x: Math.max(radius, Math.min(BOARD_WIDTH - radius, x)),
    y: Math.max(radius, Math.min(FLOOR_Y - radius, y)),
  }
}

/** Radius by value (diameter = 2*radius for display). */
const VALUE_TO_RADIUS: Record<number, number> = {
  2: 24,
  4: 28,
  8: 32,
  16: 38,
  32: 44,
  64: 50,
  128: 58,
}

export function getRadius(value: number): number {
  return VALUE_TO_RADIUS[value] ?? 24
}

export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number
): number {
  return Math.hypot(x2 - x1, y2 - y1)
}

export function doBallsCollide(
  x1: number,
  y1: number,
  r1: number,
  x2: number,
  y2: number,
  r2: number
): boolean {
  return distance(x1, y1, x2, y2) < r1 + r2
}

/** Spawn value options for new ball. */
export const SPAWN_VALUES = [2, 4, 8] as const

export function randomSpawnValue(): number {
  return SPAWN_VALUES[Math.floor(Math.random() * SPAWN_VALUES.length)]
}

/** Random X near top, within board and clear of edges. */
export function randomSpawnX(): number {
  const maxR = 44
  return maxR + Math.floor(Math.random() * (BOARD_WIDTH - 2 * maxR))
}

/** Preview zone: 0-10% board height (top 10%), ball moves horizontally only. */
export const PREVIEW_ZONE_Y_MIN = 0
export const PREVIEW_ZONE_Y_MAX = Math.floor(BOARD_HEIGHT * 0.1)
/** Dashed line at 10% height (bottom of preview zone). */
export const PREVIEW_LINE_Y = Math.floor(BOARD_HEIGHT * 0.1)
/** Fixed Y for preview (center of 0-10% zone), only x changes when dragging. */
export const PREVIEW_Y_CENTER = Math.floor((PREVIEW_ZONE_Y_MIN + PREVIEW_ZONE_Y_MAX) / 2)

export function randomPreviewPosition(): { x: number; y: number } {
  const maxR = 44
  return {
    x: maxR + Math.floor(Math.random() * (BOARD_WIDTH - 2 * maxR)),
    y: PREVIEW_Y_CENTER,
  }
}
