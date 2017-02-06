const svg = (tag, data, tree) => {
	data.ns = "http://www.w3.org/2000/svg"

	tree.forEach(node => {
		if (node.data) {
			svg(node.tag, node.data, node.tree)
		}
	})
}

module.exports = function (tag, data, tree) {
	if (tag === "svg") {
		svg(tag, data, tree)
	}

	return {
		tag: tag,
		data: data || {},
		tree: [].concat.apply([], tree)
	}
}
