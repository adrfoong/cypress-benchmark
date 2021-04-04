# cypress-benchmark

A simple Cypress plugin to run benchmark tests.

Cypress is **not** meant to be used as a performance testing tool since it has some overhead that causes things to run slower. However, if you're already using Cypress and want to get some benchmarks on the performance of your app, this will at least give you a good starting point.

## Setup

`npm install --save-dev cypress-benchmark`

There are 3 parts to this plugin package, the `plugin`, the `commands`, and the test wrapper.

### `plugin`

Setup the plugin in your plugins file

```js
let setupPlugin = require('cypress-benchmark/plugin')

module.exports = (on, config) => {
    /**
     * ...other plugins
     */
    setupPlugin(on)
}
```

If you don't already have a plugins file (typically `cypress/plugins/index.js`), create one with the snippet above. See https://on.cypress.io/plugins-guide for details.

### `commands`

Import the commands in your support file.

```js
import commands from 'cypress-benchmark/commands'
```

This is typically in `cypress/support/index.js`. See https://on.cypress.io/configuration for details.

### Test wrapper

In your spec files, you can now import `cypress-benchmark`, and use it as if it were the global `it` method:

```js
import benchmark from 'cypress-benchmark';

benchmark('My Benchmark Test', () => {
    cy.visit('...')

    cy.mark('start')
    /**
     * ...perform actions to measure
     */
    cy.mark('end')

    cy.measure('Data load time', 'start', 'end')
})
```

An alternative to importing the test wrapper in every spec file is to add it to the global scope in the support file where you would import `commands`:

```js
import benchmark from 'cypress-benchmark';

global.benchmark = benchmark;
```

Now you should have `benchmark` available globally just like `it` and `describe`.

## Usage

### `benchmark(name, [options], test)`

Runs a test and compiles measures recorded in the test.

#### `name: String`
*Required*

Name of the benchmark, similar in hierarchy to a `describe`

#### `options: Object`

An optional set of parameters described [below](#Options).

#### `test: Function`
*Required*

The test function to run.

`benchmark` should be used in conjunction with the support commands `cy.mark` and `cy.measure` which are just wrappers for the respective `performance` methods.


```js
import benchmark from 'cypress-benchmark';

benchmark('My Benchmark Test', () => {
	cy.visit('/');

	cy.mark('start1');
	/**
	 * ...perform actions to measure
	 */
	cy.mark('end1');

	cy.mark('start2');
	/**
	 * ...perform some other actions to measure
	 */
	cy.mark('end2');

	cy.measure('Measure 1', 'start1', 'end1');
	cy.measure('Measure 2', 'start2', 'end2');
});
```

Should result in something like this in your output file:

```json
{
	"My Benchmark Test": {
		"Measure 1": [
			41.505000030156225,
		],
		"Measure 2": [
			43.69500000029802
		]
	}
}
```

### **Options**

`benchmark` supports an optional second parameter which allows the following options to be set:

#### `merge: Boolean`
Default: `true`

Determines if the new results should be merged in with the existing results. Setting to `false` will overwrite the output file.

#### `runCount: Number`
Default: `1`

Number of times to run the `test`

#### `outPath: String`
Default: `'benchmark.json'`

File path to write the results to. The path is relative to the Cypress root.

## Support commands

The two support commands `cy.mark` and `cy.measure` simply call the respective methods from `performance`.

