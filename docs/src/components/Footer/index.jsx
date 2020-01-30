import './style.css'

export default () => (
  <footer>
    <nav>
      <a class="arrow-link" href="https://twitter.com/hyperappjs" target="_blank" rel="noopener noreferrer">twitter</a>
      <a class="arrow-link" href="https://github.com/jorgebucaran/hyperapp" target="_blank" rel="noopener noreferrer">github</a>
      <a class="arrow-link" href="https://hyperappjs.herokuapp.com/" target="_blank" rel="noopener noreferrer">slack</a>
    </nav>
    <p><small><b>Is anything wrong, unclear, missing?<br />Help us <a href="https://github.com/jorgebucaran/hyperapp" target="_blank" rel="noopener noreferrer">improve this site</a>!</b></small></p>
    <p><small><b>© {new Date().getFullYear()} Jorge Bucaran</b></small></p>
  </footer>
)
