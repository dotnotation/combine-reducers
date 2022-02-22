import { combineReducers } from "redux";
import uuid from "uuid"; 
// We're using a useful package, uuid, to handle unique ID generation. With this refactor, since we are creating an author ID from within the reducer instead of in AuthorInput.js, we need to import it here as well.


const rootReducer = combineReducers({
  authors: authorsReducer,
  books: booksReducer
});
// Through combineReducer, we're telling Redux to produce a reducer which will return a state that has two keys: a key of books with a value equal to the return value of the booksReducer() and a key of authors with a value equal to the return value of the authorsReducer(). If you look at the booksReducer() and the authorsReducer() above, you will see that each returns a default state of an empty array. This will produce the same initial state that we originally specified when we built the combined reducer ourselves:

export default rootReducer;

// Now if we examine the authorsReducer(), notice that this reducer only concerns itself with its own slice of the state. This makes sense. Remember that ultimately the array that the authorsReducer() returns will be the value associated with the key of authors in our application state object. Consequently, the authorsReducer() should only receive as its state argument the value of state.authors, in other words, the authors array. This means that we no longer need to retrieve the list of authors with a call to state.authors, but instead can access it simply by calling state.

function booksReducer(state = [], action) {
  let idx;
  switch (action.type) {
    case "ADD_BOOK":
      return [...state, action.book];

    case "REMOVE_BOOK":
      idx = state.findIndex(book => book.id  === action.id)
      return [...state.slice(0, idx), ...state.slice(idx + 1)];

    default:
      return state;
  }
}

function authorsReducer(state = [], action) {
  let idx;
  switch (action.type) {
    case "ADD_AUTHOR":
      return [...state, action.author];

    case "REMOVE_AUTHOR":
      idx = state.findIndex(author => author.id === action.id);
      return [...state.slice(0, idx), ...state.slice(idx + 1)];

    case "ADD_BOOK":
      let existingAuthor = state.filter(
        author => author.authorName === action.book.authorName
      );
      if (existingAuthor.length > 0) {
        return state;
      } else {
        return [...state, { authorName: action.book.authorName, id: uuid() }];
      }

    default:
      return state;
  }
}
// In the new "ADD_BOOK" case, we're checking to see if any of the authorNames currently stored in state match the name dispatched from the BookInput component. If the name already exists, state is returned unchanged. If the name is not present, it is added to the authors array. 