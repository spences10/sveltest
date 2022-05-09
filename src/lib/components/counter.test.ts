import {
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/svelte'
import { afterEach, describe, expect, it } from 'vitest'
import Counter from './counter.svelte'

describe('Hello.svelte', () => {
  // TODO: @testing-library/svelte claims to add this automatically but it doesn't work without explicit afterEach
  afterEach(() => cleanup())

  it('mounts', () => {
    const { container } = render(Counter, { count: 4 })
    expect(container).toBeTruthy()
    expect(container.innerHTML).toContain('4 x 2 = 8')
    expect(container.innerHTML).toMatchSnapshot()
  })

  it('updates on button click', async () => {
    render(Counter, { count: 4 })
    const btn = screen.getByRole('button')
    const div = screen.getByText('4 x 2 = 8')
    await fireEvent.click(btn)
    expect(div.innerHTML).toBe('4 x 3 = 12')
    await fireEvent.click(btn)
    expect(div.innerHTML).toBe('4 x 4 = 16')
  })
})
