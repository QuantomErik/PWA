/**
 *
 * @param input
 */
export function escapeInput (input) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/**
 *
 * @param input
 */
export function isValidInput (input) {
  const maxLength = 1000
  return input.length <= maxLength
}
