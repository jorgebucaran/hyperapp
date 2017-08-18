# Contributing to Hyperapp

Thank you for taking the time to read our contribution guidelines. You can start to contribute in many ways, from writing tutorials, improving the documentation, filing bug reports and requesting new features.

## Code of Conduct

Our open source community strives to:

- **Be nice.**
- **Be welcoming**: We strive to be a community that welcomes and supports people of all backgrounds and identities.
- **Be considerate**: Remember that we're a world-wide community, so you might not be communicating in someone else's primary language.
- **Be respectful**:  Not all of us will agree all the time, but disagreement is no excuse for poor behavior and poor manners.
- **Be careful in the words that you choose**: We are a community of professionals, and we conduct ourselves professionally. Be kind to others. Do not insult or put down other participants. Harassment and other exclusionary behavior aren't acceptable.

This code is not exhaustive or complete. It serves to distill our common understanding of a collaborative, shared environment, and goals. We expect it to be followed in spirit as much as in the letter.

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting us at <hyperappjs@gmail.com>.

## Code Style

- Prefer descriptive single-word variable / function names to single-letter names.
- Format your code before committing using [prettier](https://prettier.github.io/prettier) or run the `format` script.
- We use ES6 modules but the rest of the code base is written in ES5.
- We prefer keeping all the moving parts inside as few files as possible. We don't have plans to break up the library into smaller modules.

## Filing Bugs

- Before submitting a bug report, search the issues for similar tickets. Your issue may have already been discussed and resolved. Feel free to add a comment to an existing ticket, even if it's closed.
- Determine which repository the problem should be reported in. If you have an issue with the Router, you'll be better served in [hyperapp/router](https://github.com/hyperapp/router), etc.
- If you have a question or need help with something you are building, we recommend joining the [Hyperapp Slack Team](https://hyperappjs.herokuapp.com).
- Be thorough in your title and report, don't leave out important details, describe your setup and include any relevant code with your issue.
- Use GitHub [fenced code blocks](https://help.github.com/articles/creating-and-highlighting-code-blocks/) when sharing code. If your code has JSX in it, please use <code>```jsx</code> for accurate syntax highlighting.

## Writing Tests

- We use [Babel](https://babeljs.io) and [Jest](http://facebook.github.io/jest) to run the tests.
- Feel free to create a new `test/*.test.js` file if none of the existing test files suits your test case.
- Tests usually start by creating a small application and using a feature, then check if `document.body.innerHTML` matches some expected string. The app call is async, so we often rely on [oncreate](/docs/api.md#oncreate) or [onupdate](/docs/api.md#onupdate) events to detect when the view has been rendered.
- We use [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) to throttle renders, but it is not natively supported by Jest. For this reason you'll often see the following code at the top of a test file:

  ```js
  window.requestAnimationFrame = setTimeout
  ```

