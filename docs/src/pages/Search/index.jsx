import './style.css'
import Link from '../../components/Link'

export default (state) => {
  const search = state.location.queryParams.q

  if (!state.searchData) {
    return (
      <div>
        <h4>Loading search data...</h4>
      </div>
    )
  }

  const results = Object.keys(state.searchData).filter(page => state.searchData[page].includes(search))

  return (
    <div class="search-results-page">
      <h1>results:</h1>
      <p><b>{results.length} items found for <em>{search}</em></b></p>
      <ul class="results">
        {results.map(result => (
          <li>
            <Link to={`/${result}`}>
              {result}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
