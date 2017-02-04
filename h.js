module.exports = function (tag, data, tree) {
    if (tag === "svg") {
        svg(tag, data, tree)
    }

    tree = Array.isArray(tree) ? tree : [tree];

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
