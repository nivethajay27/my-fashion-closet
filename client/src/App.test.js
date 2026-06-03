import { render, screen } from '@testing-library/react';
import App from './App';

test('renders fashion closet navigation', () => {
  render(<App />);
  const linkElement = screen.getByText(/Fashion Closet/i);
  expect(linkElement).toBeInTheDocument();
});
