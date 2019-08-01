export function getType(target: any): string {
	const typeofType = typeof target;
	if (typeofType === 'object') {
		if (target === null) {
			return 'null';
		} else {
			return Object.prototype.toString
				.call(target)
				.replace(/^\[object\s(.*)\]$/, '$1')
				.toLowerCase();
		}
	} else {
		return typeofType;
	}
}