export const isEmpty = value => value === undefined
	|| value === null
	|| (typeof value === 'object' && Object.keys(value).length === 0)
	|| (typeof value === 'string' && value.trim().length === 0);

export const isInteger = value => Number.isInteger(value) && /^\+?(0|[1-9]\d*)$/.test(value);
