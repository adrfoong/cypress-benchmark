const fs = require('fs');
const deepmerge = require('deepmerge');

function setupPlugin(on) {
    on('task', {
		writeBenchmarkFile({ path, merge, content } = {}) {
			let output = content;

			if (merge) {
				let json = fs.existsSync(path) ? JSON.parse(fs.readFileSync(path)) : {};
				output = deepmerge(json, output);
			}

			fs.writeFileSync(path, JSON.stringify(output, null, '\t'));
			return null;
		},
	});
}

module.exports = setupPlugin