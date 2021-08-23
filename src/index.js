/**
 * Caution: Consider this file when using react-scripts
 * 
 * You may delete this file and its occurrences from the project filesystem if you are using GatsbyJS or NextJS version
 */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";

import * as serviceWorker from './serviceWorker';

import store from "./redux/store";
import App from './App';


const render = () => ReactDOM.render(
    // <React.StrictMode>
        <Provider store={store}>
            <App />
        </Provider>
    // </React.StrictMode>
    ,
    document.getElementById('root')
)

render()


serviceWorker.unregister();



// const store = createStore(counter)
// store.subscribe(render)

