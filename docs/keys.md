# Keys

Every time your application is rendered, the actual DOM is made to match the [virtual node](/docs/virtual-node.md) tree, as efficiently as possible. In the process, Elements may be replaced or removed. In those instances, any modifications made to Elements directly (by you, through [VirtualDOM events](/docs/vdom-events.md), or by the browser), will be lost.

However, setting the `key` property on a node, you declare that the node should correspond to a particular Element. This allows the rendering process to *move* an Element into it's new position, rather than risk destroying it.

A key must be unique among sibling-nodes, and must be used in every render for as long as you need it to correspond to an Element.

```jsx
const ImageGallery = images =>
  <ul>
    {images.map(({ hash, url, description }) =>
      <li key={hash}>
        <img src={url} alt={description} />
      </li>
    )}
  </ul>
```

Don't use an array index as key, if the index also specifies the order of siblings. If the position and number of items in a list is fixed, it will make no difference, but if the list is dynamic, the key will change every time the tree is rebuilt.

To select a valid key, find a unique property for each item among its siblings.

```jsx
const PlayerList = players =>
  <ul>
    {players
      .sort((player, nextPlayer) => nextPlayer.score - item.score)
      .map(player =>
        <li key={player.username} class={player.isAlive ? "alive" : "dead"}>
          <PlayerCard {...player} />
        </li>
      )}
  </ul>
```

## Top-Level Nodes

Keys are not registered on the top-level node of your [view](/docs/view.md). If you are toggling the top-level view, and you must use keys, wrap them in an unchanging node.
