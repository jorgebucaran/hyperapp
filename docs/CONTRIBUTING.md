# Contributing to Hyperapp

Thank you for taking the time to read our contribution guidelines. You can contribute in many ways like writing tutorials, improving the documentation, and filing bug reports.

## Style

- Format your code before creating a new commit using `npm run format`.
- The code is written in ES5.
- We prefer keeping all the moving parts inside as few files as possible. We don't have plans to break up the library into smaller modules.

## Bugs

- Before submitting a bug report, search the issues for similar tickets. Your issue may have already been discussed and resolved. Feel free to add a comment to an existing ticket, even if it's closed.
- Determine which repository the problem should be reported in. If you have an issue with the Router, you'll be better served in [hyperapp/router](https://github.com/hyperapp/router), etc.
- If you have a question or need help with something you are building, we recommend joining the [Hyperapp Slack Team](https://hyperappjs.herokuapp.com).
- Be thorough in your title and report, don't leave out important details, describe your setup and include any relevant code with your issue.
- Use GitHub [fenced code blocks](https://help.github.com/articles/creating-and-highlighting-code-blocks/) when sharing code. If your code has JSX in it, please use <code>```jsx</code> for best syntax highlighting.

## Tests

- We use [Babel](https://babeljs.io) and [Jest](http://facebook.github.io/jest) to run the tests.
- Feel free to create a new `test/*.test.js` file if none of the existing test files suits your test case.
- Tests usually start by creating a small application and using a feature, then check if `document.body.innerHTML` matches some string. The app() call is async, so we often use [oncreate](lifecycle.md#oncreate) or [onupdate](lifecycle.md#onupdate) events to detect when the view has been rendered.

## Humans

Our open source community strives to be nice, welcoming and professional. Instances of abusive, harassing, or otherwise unacceptable behavior can be reported by contacting us at <hyperappjs@gmail.com>.
