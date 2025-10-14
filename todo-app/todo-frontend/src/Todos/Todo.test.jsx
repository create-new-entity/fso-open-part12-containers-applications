

import { render, screen } from '@testing-library/react'
import Todo from './Todo'


test('renders content', () => {
  const todo = {
    text: 'Test task.',
    done: false
  }

  render(<Todo todo={todo} deleteTodo={() => {}} completeTodo={() => {}}/>)

  const element = screen.getByText('Test task.')
  expect(element).toBeDefined()
})