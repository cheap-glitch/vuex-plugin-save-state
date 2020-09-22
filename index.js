
/**
 * vuex-plugin-save-state
 *
 * A tiny  Vuex plugin to automatically  save and restore the  store state using
 * the browser's local storage.
 *
 * Copyright (c) 2020-present, cheap glitch
 * This software is distributed under ISC license
 */

const defaultOptions = {
	namespace:      'vuex',
	savedByDefault: false,
};

/**
 * Return a function to instantiate the Vuex plugin
 */
export function saveStatePlugin(stateModel, options = {})
{
	options = { ...defaultOptions, ...(options || {})};

	return function(store)
	{
		// Declare a function to check that a prop has been stored and that the stored value passes validation
		const checkProp = (prop, storedValue) => !!storedValue
			&& (prop.saved === undefined ? options.savedByDefault : prop.saved)
			&& (!prop.validator || prop.validator(storedValue));

		// Get the stored state
		let storedState = {};
		try { storedState = JSON.parse(localStorage.getItem(options.namespace) || '{}'); } catch (_) { storedState = {}; }

		// Filter it and do a deep merge with the default state
		store.replaceState(Object.fromEntries(Object.entries(stateModel)

			// Remove non-object properties
			.filter(([key, prop]) => !!prop && Object.prototype.toString.call(prop) !== '[object Object]')

			.map(([key, prop]) => (Object.keys(prop).every(k => ['saved', 'default', 'validator'].includes(k)))

				// Add a store property
				? [key, checkProp(prop, storedState[key]) ? storedState[key] : prop.default]

				// Add a store module
				: [key, Object.fromEntries(Object.entries(prop).map(
					([subkey, subprop]) => [subkey, checkProp(subprop, (storedState[key] || {})[subkey]) ? storedState[key][subkey] : subprop.default]
				))]
			)
		));

		// Subscribe to the store and save the state upon every mutation
		store.subscribe((_, state) => localStorage.setItem(options.namespace, JSON.stringify(state)));
	};
}

/**
 * Take an object of the form [key]: {options}
 * and returns an object of the form [key]: <defaultValue>
 */
export function getVuexState(state)
{
	return Object.fromEntries(Object.entries(state).map(([key, value]) => [key, value.default || null]));
}
