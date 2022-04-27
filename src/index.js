import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import * as themes from './theme/schema.json';
import { setToLS } from './utils/storage';
import {generateRandomPopulation} from './utils/population'

const Index = () => {
  setToLS('all-themes', generateRandomPopulation())
  //setToLS('all-themes', themes.default);

  return(
    <App />
  )
}

ReactDOM.render(
    <Index />,
  document.getElementById('root')
);

