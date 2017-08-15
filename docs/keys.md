# Keys

Every time your application is rendered, a [virtual node](/docs/virtual-nodes.md) tree is created from scratch.

Keys help identify which nodes were added, changed or removed in a list when comparing the old and new tree.

Use keys to identify items in a list that can be re-ordered or where items can be added to / removed from.

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

Don't use an array index as key. If the position and number of items in a list is fixed, it will make no difference, but if the list is dynamic, the key will change every time the tree is rebuilt.

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
