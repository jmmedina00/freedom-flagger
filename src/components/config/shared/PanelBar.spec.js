import { render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import PanelBar from './PanelBar.vue';

describe('PanelBar', () => {
  const generate = (props) =>
    render(PanelBar, {
      props,
      global: { mocks: { $t: (foo) => foo } },
    });

  test('should have styles according to color', () => {
    const { container } = generate({ name: 'Test', color: 'red' });

    const wrapper = container.querySelector(
      '.is-flex.has-background-red.has-text-red-dark'
    );
    expect(wrapper).toBeTruthy();
  });

  test('should have light title when color is defined', () => {
    const { container } = generate({ name: 'Test', color: 'red' });

    const title = container.querySelector('.has-text-light');
    expect(title).toBeTruthy();
  });

  test('should not have styles when color is not defined', () => {
    const { container } = generate({ name: 'Test' });

    const wrapper = container.querySelector('.is-flex');
    const classes = [...wrapper.classList.values()];

    expect(classes.find((klass) => klass.includes('has-text'))).toBeFalsy();
    expect(
      classes.find((klass) => klass.includes('has-background'))
    ).toBeFalsy();

    const title = container.querySelector('.has-text-light');
    expect(title).toBeFalsy();
  });
});
