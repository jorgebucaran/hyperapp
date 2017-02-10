module.exports = function (tag, data) {
	var tree = []
	tree.push.apply(tree, arguments)
	tree.shift()
	tree.shift()
	var head = tree[0]

	tree = Array.isArray(head) || head === undefined ? head : tree

	if (typeof tag === "function") {
		return tag({
			props: data,
			children: tree || []
		})
	}

	if (tag === "svg") {
		svg(tag, data, tree)
	}

	return {
		tag: tag,
		data: data || {},
		tree: [].concat.apply([], tree)
	}
}

function svg(tag, data, tree) {
	data.ns = "http://www.w3.org/2000/svg"

	for (var i = 0; i < tree.length; i++) {
		var node = tree[i]
		if (node.data) {
			svg(node.tag, node.data, node.tree)
		}
	}
}

