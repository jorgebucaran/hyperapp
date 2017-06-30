In this section we'll implement a emoji search and learn how to use single responsibility components. 

Below is the code for Emoji Search. [Try it online](http://searchemoji.surge.sh/)

```javascript
import { h, app } from "hyperapp";
import filterEmoji from "./FilterEmoji";
import "./App.css";

const SearchInput = ({ handleChange }) => (
  <div>
    <input
      className="search-bar"
      type="text"
      placeholder="Search for emoji ..."
      onkeyup={handleChange}
      oncreate={(element) => element.focus()}
    />
  </div>
);

const ShowEmoji = ({ listOfEmoji }) => (
  <div>
    {listOfEmoji.map((emoji, i) => (
      <div className="items">
        <img
          className="image"
          key={i}
          src={`//cdn.jsdelivr.net/emojione/assets/png/${emoji.symbol
            .codePointAt(0)
            .toString(16)}.png`}
        />
        <span className="title">
          {emoji.title}
        </span>
      </div>
    ))}
  </div>
);

let App = app({
  state: {
    arrayOfEmoji: filterEmoji("", 20) || []
  },
  view: (state, actions) => {
    return (
      <div>
        <h1 className="heading">Search your favourite emoji</h1>
        <SearchInput handleChange={actions.handleChange} />
        <ShowEmoji listOfEmoji={state.arrayOfEmoji} />
      </div>
    );
  },
  actions: {
    handleChange: (state, actions, e) => ({
      arrayOfEmoji: filterEmoji(e.target.value, 20)
    })
  },
  root: document.getElementById("app")
});

export default App;
```

 Let's break down !
 
 ```javascript
   state: {
    arrayOfEmoji: filterEmoji("", 20) || []
  },
 ```
 
 Here we are storing the filtered emojis based on the search input. `filterEmoji` is a function that given an emoji it filters the title and keywords and performs the slice operations to return the emoji that we want.
 
 ```javascript
   actions: {
    handleChange: (state, actions, e) => ({
      arrayOfEmoji: filterEmoji(e.target.value, 20)
    })
  },
 ```
 
 The `handleChange` method takes care of updating the state on input change.
 
 ```html
   <div>
    <h1 className="heading">Search your favourite emoji</h1>
    <SearchInput handleChange={actions.handleChange} />
    <ShowEmoji listOfEmoji={state.arrayOfEmoji} />
   </div>
 ```
 
 You can see that in the above code components `SearchInput` and `ShowEmoji` have a single responsibility to change the data and this responsibility is entirely encapsulated by the `App`. 
 
 ```javascript
 const SearchInput = ({ handleChange }) => (
  <div>
    <input
      className="search-bar"
      type="text"
      placeholder="Search for emoji ..."
      onkeyup={handleChange}
    />
  </div>
);
 
 ```
 
 Now we listen for any input change and update the state through the action `handleChange`.
 
 ```javascript

 const ShowEmoji = ({ listOfEmoji }) => (
  <div>
    {listOfEmoji.map((emoji, i) => (
      <div className="items">
        <img
          className="image"
          key={i}
          src={`//cdn.jsdelivr.net/emojione/assets/png/${emoji.symbol
            .codePointAt(0)
            .toString(16)}.png`}
        />
        <span className="title">
          {emoji.title}
        </span>
      </div>
    ))}
  </div>
);
 ```
 
 Finally we render the list of the emojis!
