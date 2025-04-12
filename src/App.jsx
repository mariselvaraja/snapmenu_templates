import React from 'react';
import { Provider } from 'react-redux';
import { store } from './common/store';
import PizzaApp from './templates/pizza_template/App';

export default function App() {
  // Directly load the pizza template
  return (
    <Provider store={store}>
      <PizzaApp />
    </Provider>
  );
}
