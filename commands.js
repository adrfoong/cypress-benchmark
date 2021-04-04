Cypress.Commands.add('mark', name => {
	window.performance.mark(name);
	Cypress.log({
		name: 'mark',
		displayName: 'mark',
		message: `Marking **${name}**`,
	});
});

function recordMeasure(name, measure) {
	let specName = Cypress.mocha.getRunner().suite.title;
	if (!Cypress.measures) {
		Cypress.measures = {
			[specName]: {
				[name]: [measure.duration],
			},
		};
	} else if (!Cypress.measures[specName]) {
		Cypress.measures[specName] = {
			[name]: [measure.duration],
		};
	} else {
		Cypress.measures[specName][name].push(measure.duration);
	}
}

Cypress.Commands.add('measure', (name, start, end) => {
	let measure = window.performance.measure(name, start, end);
	recordMeasure(name, measure);

	Cypress.log({
		name: 'measure',
		displayName: 'measure',
		message: `**${measure.name}**: ${measure.duration}`,
		consoleProps: () => {
			return {
				Name: measure.name,
				Start: start,
				End: end,
				Duration: measure.duration,
				Measure: measure,
			};
		},
	});
});
