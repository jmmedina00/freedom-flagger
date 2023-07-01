import { render } from '@testing-library/vue';
import { describe, expect } from 'vitest';
import PanelBar from './PanelBar.vue';

describe('PanelBar', () => {
  test('should have styles according to color', () => {
    const { container } = render(PanelBar, {
      props: { name: 'Test', color: 'red' },
    });

    const wrapper = container.querySelector(
      '.has-background-red.has-text-red-dark'
    );
    expect(wrapper).toBeTruthy();
  });
});
