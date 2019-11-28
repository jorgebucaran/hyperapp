import './style.css'

const placeholderResults = [
  'Array',
  'append',
  'foldl',
  'foldr',
  'indexedMap',
  'toIndexedList',
  'Basics',
  'Order',
  'degrees',
  'identity',
  'modBy',
  'radians',
  'remainderBy',
  'round',
  'Bitwise',
  'and',
  'Char',
  'fromCode',
  'isDigit',
  'isHexDigit',
  'isOctDigit',
  'toCode',
  'Debug',
  'todo',
  'Dict',
  'Dict',
  'diff',
  'foldl',
  'foldr',
  'update'
]

export default (state) => {
  const results = placeholderResults
    .filter(item => item.includes(state.location.queryParams.q))

  return (
    <div class="search-results-page">
      <h1>results:</h1>
      <p><b>{results.length} items found for <em>{state.location.queryParams.q}</em></b></p>
      <ul class="results">
        {results.map(result => (
          <li>{result}</li>
        ))}
      </ul>
    </div>
  )
}
