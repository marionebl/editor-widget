import {entries} from 'lodash';

export function resolveBinding(name, bindings) {
	if (!name) {
		return;
	}

	const matches = entries(bindings)
		.reduce((registry, entry) => {
			const [binding, names] = entry;
			if (names.includes(name)) {
				registry.push(binding);
			}
			return registry;
		}, []);

	return matches[0];
}

export default resolveBinding;
