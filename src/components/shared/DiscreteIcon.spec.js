import { render } from '@testing-library/vue';
import { describe, expect } from 'vitest';
import DiscreteIcon from './DiscreteIcon.vue';

describe('DiscreteIcon', () => {
  test('should default to rednering to Material Icons', () => {
    const { container } = render(DiscreteIcon, {
      props: { icon: 'face' },
    });

    const element = container.querySelector('.icon .material-icons');
    expect(element.innerHTML.trim()).toEqual('face');
  });

  test('should go for an image if provided with a path', () => {
    const { container } = render(DiscreteIcon, {
      props: { icon: 'path/to/icon.png' },
    });

    const element = container.querySelector('.icon img');
    expect(element.src).toEqual('path/to/icon.png');
  });
});
