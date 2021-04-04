/**
 *
 * @param {string} name - Test name
 * @param {Object} options
 * @param {boolean} options.merge - If true, merge entries instead of replacing them in final output.
 * @param {number} options.runCount - Number of times to run the test.options
 * @param {string} options.outPath - Path to output file
 * @param {function} _test - Test body to pass into `it`
 */
 function benchmark(name, { merge = true, runCount = 1, outPath = 'benchmark.json' } = {}, _test) {
	let test;

	if (arguments.length < 3) {
		// assume that second param is test
		test = arguments[1];
	} else {
		test = _test;
	}

	describe(name, () => {
		after(() => {
			cy.task('writeBenchmarkFile', { path: outPath, content: Cypress.measures, merge });
		});

		Cypress._.times(runCount, i => {
			it(`Run ${i + 1}`, { retries: 0 }, test);
		});
	});
}

export default benchmark;