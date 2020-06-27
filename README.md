# vuex-plugin-save-state
![license badge](https://badgen.net/github/license/cheap-glitch/vuex-plugin-save-state?color=green)
![latest release badge](https://badgen.net/github/release/cheap-glitch/vuex-plugin-save-state?color=green)

This plugin  allows you to  automatically save the state  of your Vuex  store on
every mutation, and to have it restored on page load. Features:
 * 📜 define the state properties and their options in a single object
 * ✅ provide default values & optionally validate the saved data
 * 📦 works with store modules

## Installation

```shell
npm i vuex-plugin-save-state
```


## Usage

### Basic usage

The plugin  works using  a "model", which  is an object  describing all  of your
store state properties and their associated  metadata. Below is a simple example
demonstrating the usage of all the options recognized by the plugin:

```javascript
const model = {
	count: {
		// The initial value of the prop
		default: 'user',

		// Unnecessary if the option 'savedByDefault' is set to `true`
		saved: true,
	},
	username: {
		default: 'anonymous',
		saved: true,

		// A function returning a boolean
		// If it returns `false`, the stored value will be
		// ignored and the default will be used
		validator: v => (typeof v == 'string' && v.length <= 20)
	},
	ignoredProp: {
		default: [],

		// This property will not be stored in local storage
		saved: false,
	},
}
```

Then you need to create the store instance.  Since Vuex expect the state to be a
simple one-level  object, the  package provides  the `getVuexState`  function to
strip all the extra info from the model:

```javascript
import { getVuexState, saveStatePlugin } from 'vuex-plugin-save-state'

new Vuex.Store({
	state: getVuexState(model),

	// getters, mutations et al.

	plugins: [
		saveStatePlugin(model, {
			/**
			 * The storage key for the state object.
			 * You can use this to do basic versioning
			 * on your store properties.
			 *
			 * Default value: 'vuex'
			 */
			namespace: 'myapp',

			/**
			 * Whether all store properties should be
			 * saved by default or not.
			 *
			 * Default value: false
			 */
			 savedByDefault: true,
		});
	]
});
```


### Using with store modules

```javascript
import moduleA from './moduleA'
import moduleB from './moduleB'

new Vuex.Store({
	state: getVuexState(model),

	modules: {
		moduleA,
		moduleB,
	},

	plugins: [
		saveStatePlugin({
			...model,
			moduleA: moduleA.model,
			moduleB: moduleB.model,
		}, {
			namespace: 'myapp',
			savedByDefault: true,
		});
	]
});
```


## License

This software is distributed under the ISC license.
