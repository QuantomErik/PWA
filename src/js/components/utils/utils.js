/**
 * Escapes special characters in the input string to prevent XSS attacks.
 * Replaces characters like &, <, >, ", and ' with their HTML entity equivalents.
 *
 * @param {string} input - The string to be escaped.
 * @returns {string} The escaped string, safe for rendering in the HTML document.
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
 * Checks if the input string is valid based on certain criteria.
 * Currently, it validates the length of the input string.
 *
 * @param {string} input - The input string to be validated.
 * @returns {boolean} True if the input is valid, false otherwise.
 */
export function isValidInput (input) {
  const maxLength = 1000
  return input.length <= maxLength
}
