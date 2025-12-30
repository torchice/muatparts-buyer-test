/**
 * Creates a debounced function that delays invoking the provided function until after the specified wait time has elapsed since the last time the debounced function was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {number} wait - The number of milliseconds to delay.
 * @returns {Function} - Returns the new debounced function.
 */
function debounce(func, wait) {
  let timeout;

  function debounced(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  }

  debounced.cancel = function () {
    clearTimeout(timeout);
  };

  return debounced;
}

export default debounce;
