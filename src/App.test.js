import { render, screen } from '@testing-library/react';
import { fireEvent } from '@testing-library/react';
import App from './App';

test("renders registration form", () => {
  render(<App />);
  const form = screen.getByText(/Welcome/i);
  expect(form).toBeInTheDocument();
});
// test('check counter on click me button', () => {
//   render(<App />);
//   const button = screen.getByRole('button');
//   const counter = screen.getByTestId('count')
//   expect(button).toBeInTheDocument();
//   expect(counter).toBeInTheDocument();
//   expect(counter).toHaveTextContent("0");
//   fireEvent.click(button);
//   expect(counter).toHaveTextContent("1");
// });

