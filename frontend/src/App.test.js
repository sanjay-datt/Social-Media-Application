import { render, screen } from '@testing-library/react';
import App from './App';

test('renders login page when not authenticated', () => {
  // Clear any stored user info to ensure we are unauthenticated
  localStorage.clear();
  render(<App />);
  // The app should redirect to /login and show the sign in form
  expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
});
