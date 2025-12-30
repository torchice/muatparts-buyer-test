/**
 * Rules for validation
 * @type {Object}
 * @property {Function} required - Value cannot be empty
 * @property {Function} number - Value must be a number
 * @property {Function} minLength - Value must have at least the given length
 * @property {Function} maxLength - Value must have at most the given length
 * @property {Function} min - Value must be at least the given number
 * @property {Function} max - Value must be at most the given number
 * @property {Function} alphanumeric - Value must be alphanumeric
 * @property {Function} refine - Runs a custom validation function
 */
const defaultRules = {
	/**
	 * Value cannot be empty
	 * @param {*} value - Value to be validated
	 * @param {string|Function} [message='Wajib diisi.'] - Error message or callback with value as the param
	 * @returns {string|null} Error message if invalid, null if valid
	 */
	required: (value, message) =>
		!value && value === ""
			? typeof message === "function"
				? message(value)
				: message || "Wajib diisi."
			: null,

	/**
	 * Value must be a number
	 * @param {*} value - Value to be validated
	 * @param {string|Function} [message='Harus berupa angka.'] - Error message or callback with value as the param
	 * @returns {string|null} Error message if invalid, null if valid
	 */
	number: (value, message) =>
		isNaN(Number(value))
			? typeof message === "function"
				? message(value)
				: message || "Harus berupa angka."
			: null,

	/**
	 * Value must have at least the given length
	 * @param {*} value - Value to be validated
	 * @param {number} length - Minimum length
	 * @param {string|Function} [message=`Harus memiliki panjang minimal ${length} karakter.`] - Error message or callback with value as the param
	 * @returns {string|null} Error message if invalid, null if valid
	 */
	minLength: (value, length, message) =>
		value.length < length
			? typeof message === "function"
				? message(value)
				: message ||
				  `Harus memiliki panjang minimal ${length} karakter.`
			: null,

	/**
	 * Value must have at most the given length
	 * @param {*} value - Value to be validated
	 * @param {number} length - Maximum length
	 * @param {string|Function} [message=`Harus memiliki panjang maksimal ${length} karakter.`] - Error message or callback with value as the param
	 * @returns {string|null} Error message if invalid, null if valid
	 */
	maxLength: (value, length, message) =>
		value.length > length
			? typeof message === "function"
				? message(value)
				: message ||
				  `Harus memiliki panjang maksimal ${length} karakter.`
			: null,

	/**
	 * Value must be at least the given number
	 * @param {*} value - Value to be validated
	 * @param {number} min - Minimum number
	 * @param {string|Function} [message=`Harus memiliki nilai minimal ${min}.`] - Error message or callback with value as the param
	 * @returns {string|null} Error message if invalid, null if valid
	 */
	min: (value, min, message) =>
		Number(value) < min
			? typeof message === "function"
				? message(value)
				: message || `Harus memiliki nilai minimal ${min}.`
			: null,

	/**
	 * Value must be at most the given number
	 * @param {*} value - Value to be validated
	 * @param {number} max - Maximum number
	 * @param {string|Function} [message=`Harus memiliki nilai maksimal ${max}.`] - Error message or callback with value as the param
	 * @returns {string|null} Error message if invalid, null if valid
	 */
	max: (value, max, message) =>
		Number(value) > max
			? typeof message === "function"
				? message(value)
				: message || `Harus memiliki nilai maksimal ${max}.`
			: null,

	/**
	 * Value must be alphanumeric
	 * @param {*} value - Value to be validated
	 * @param {string|Function} [message='Harus berupa huruf dan angka.'] - Error message or callback with value as the param
	 * @returns {string|null} Error message if invalid, null if valid
	 */
	alphanumeric: (value, message) =>
		/[^a-zA-Z0-9]/.test(value)
			? typeof message === "function"
				? message(value)
				: message || "Harus berupa huruf dan angka."
			: null,

	/**
	 * Runs a custom validation function
	 * @param {*} value - Value to be validated
	 * @param {Function} fn - Custom validation function
	 * @param {string|Function} [message] - Error message or callback with value as the param
	 * @returns {string|null} Error message if invalid, null if valid
	 */
	refine: (value, fn) => fn(value),
};

/**
 * Object containing all validation rules
 * @type {Object}
 * @property {Function} required - Value must not be empty
 * @property {Function} email - Value must be a valid email
 * @property {Function} min - Value must be at least the given number
 * @property {Function} max - Value must be at most the given number
 * @property {Function} alphanumeric - Value must be alphanumeric
 * @property {Function} refine - Runs a custom validation function
 */
export const rules = Object.keys(defaultRules).reduce((acc, key) => {
	acc[key] = (...params) => {
		return {
			/**
			 * Validates the given value
			 * @param {*} value - Value to be validated
			 * @returns {string|null} Error message if invalid, null if valid
			 */
			validate: value => defaultRules[key](value, ...params),
			/**
			 * All validation rules
			 * @type {Object}
			 */
			...rules,
		};
	};
	return acc;
}, {});

export function validateField(value, ruleChain) {
	for (const rule of ruleChain) {
		const errorMessage = rule.validate(value);
		if (errorMessage) return errorMessage;
	}
	return null;
}

export function validateForm(formData, formRules) {
	const errors = {};

	for (const field in formRules) {
		errors[field] = validateField(formData[field], formRules[field]);
	}

	return errors;
}

//usage example

// const formRules = {
// 	name: [rules.required("Nama wajib diisi")],
// 	email: [rules.required("Email wajib diisi"), rules.email("Email tidak valid")],
// 	password: [rules.required("Password wajib diisi"), rules.minLength(8, "Password minimal 8 karakter")],
