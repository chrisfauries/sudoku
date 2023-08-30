import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '.';

it('renders', () => {
  render(<App />);
  screen.getByText(/Sudoku/i);
});
