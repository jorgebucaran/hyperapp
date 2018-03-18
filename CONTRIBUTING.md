# Contributing to Hyperapp

Thank you for taking the time to read our contribution guidelines. You can start contributing in many ways like filing bug reports, improving the documentation, or helping others.

Our open source community strives to be nice, welcoming and professional. Instances of abusive, harassing, or otherwise unacceptable behavior will not be tolerated.

## Style

* Hyperapp is written in ES3. Please don't create an issue asking us to rewrite it in ES6 or TypeScript.
* We use [Prettier](https://github.com/prettier/prettier) to format the code. If you don't have Prettier installed in your code editor or IDE, you can use `npm run format` before submitting a pull request.
* We prefer keeping all the moving parts inside as few files as possible. There are no plans to break up the library into smaller modules.

## Bugs

* Before submitting a bug report, search the issues for similar tickets. Your issue may have already been discussed and resolved. Feel free to add a comment to an existing ticket, even if it's closed.
* Determine which repository the problem should be reported in. If you have an issue with the Router, you'll be better served in [hyperapp/router](https://github.com/hyperapp/router), etc.
* If you have a question or need help with something you are building, hop on [Slack](https://hyperappjs.herokuapp.com).
* Be thorough in your title and report, don't leave out important details, describe your setup and [include any relevant code](https://en.wikipedia.org/wiki/Minimal_Working_Example) with your issue.
* Please use GitHub [fenced code blocks](https://help.github.com/articles/creating-and-highlighting-code-blocks/) when sharing code. If your code has JSX in it, use <samp>```jsx</samp> for best syntax highlighting.

## Tests

* We use [Babel](https://babeljs.io) and [Jest](http://facebook.github.io/jest) to run tests.
* Feel free to create a new `test/*.test.js` file if none of the existing test files suits your test case.
* Tests usually consist of an application demonstrating a feature, then check if <samp>document.body.innerHTML</samp> matches some string.
