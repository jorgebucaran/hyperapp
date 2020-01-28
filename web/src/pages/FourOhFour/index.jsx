import Link from '../../components/Link'
import { code } from './code'
import './style.css'

export default () => (
  <div class="four-oh-four-page">
    <h1>this page doesn't exist, please check your URL and try again</h1>
    <Link class="back-link" to="/">go back</Link>
    <div class="code-background">{code + code + code + code}</div>
  </div>
)
