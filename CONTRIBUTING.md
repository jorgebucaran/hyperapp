# Contributing to HyperApp

HyperApp is an open source project and we love to receive contributions from our community. You can start to contribute in many ways, from writing tutorials or blog posts, improving the documentation, filing bug reports and requesting new features.

## Quick Start

Clone the project and install the dependencies.

```sh
git clone https://github.com/hyperapp/hyperapp
cd hyperapp
npm i
```

Run the tests.

```
npm run test
```

## Filing Bugs

- Before submitting a bug report, search the issues for similar tickets. Your issue may have already been discussed or resolved. Feel free to add a comment to an existing ticket, even if it's closed.

- Determine which repository the problem should be reported in. If you have an issue with the website, you'll be better served in [hyperapp/website](https://github.com/hyperapp/website), etc. If you would like to share something cool you've made with HyperApp, check out [hyperapp/awesome](https://github.com/hyperapp/awesome-hyperapp).

- If you have a question or need help with something you are building, we recommend joining the [HyperApp Slack Team](https://hyperappjs.herokuapp.com).

- Be thorough in your title and report, don't leave out important details, describe your setup and include any relevant code with your issue.

- Use GitHub [fenced code blocks](https://help.github.com/articles/creating-and-highlighting-code-blocks/) to share your code. If your code has JSX in it, please use <samp>```jsx</samp> for accurate syntax highlighting.

## Code Style

- Prefer descriptive single-word variable / function names to single-letter names.

- Consider improving the [Implementation Notes](/docs/implementation-notes.md) section in the documentation before adding comments to the code.

- Format your code before adding a commit using [prettier](https://prettier.github.io/prettier) or running the <samp>format</samp> script.

  ```
  npm run format
  ```

- With the exception of the ES6 module syntax, HyperApp is written in ES5.

- We prefer keeping all the moving parts inside as few files as possible. While this may change in the future, we don't intend to break the library into smaller modules.

## Core Values

- HyperApp was born out of the attempt to do more with less.

- HyperApp's design is based on the Elm Architecture and application development is similar to React/Redux using a single immutable state tree.

- The ideal bundle size is 1 KB, but no more than 1.5 KB.

## Writing Tests

- We use [Babel](https://babeljs.io) and [Jest](http://facebook.github.io/jest) to run the tests.

- Feel free to create a new <samp>test/*.test.js</samp> file if none of the existing test files suits your test case.

- Tests usually create an application with [app](/docs/api.md#app) and check if the document.body.innerHTML matches some expected string. The app() call is async, so we sometimes use the [loaded](/docs/api.md#loaded) event to detect when the view has been attached to the document.

- HyperApp uses [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) under the hood, but it is not natively supported by Jest. For this reason you'll often see the following code at the top of a test file:

  ```js
  window.requestAnimationFrame = setTimeout
  ```

## Code of Conduct

In the interest of fostering an open and welcoming environment, we as contributors and maintainers pledge to making participation in our project and our community a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

Examples of behavior that contributes to creating a positive environment include:

* Using welcoming and inclusive language
* Being respectful of differing viewpoints and experiences
* Gracefully accepting constructive criticism

Examples of unacceptable behavior by participants include:

* The use of sexualized language or imagery and unwelcome sexual attention or advances
* Trolling, insulting/derogatory comments, and personal or political attacks
* Public or private harassment

Instances of abusive, harassing, or otherwise unacceptable behavior may be reported by contacting the project team at <hyperappjs@gmail.com>. The project team will review and investigate all complaints, and will respond in a way that it deems appropriate to the circumstances. The project team is obligated to maintain confidentiality with regard to the reporter of an incident. Further details of specific enforcement policies may be posted separately.

This Code of Conduct is adapted from the [Contributor Covenant](http://contributor-covenant.org).


