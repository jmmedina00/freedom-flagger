import { render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import DemoMiniFlag from './DemoMiniFlag.vue';
import { inject, ref } from 'vue';
import { DECORATE_SIZE } from '@app/state';
import { useFullStateSize } from '@app/components/render/helper/size';

vi.mock('@app/components/render/helper/size');

describe('DemoMiniFlag', () => {
  const generate = () =>
    render(DemoMiniFlag, {
      props: {
        component: 'RandomDecorate',
      },
      global: {
        stubs: {
          RandomDecorate: {
            setup: () => {
              const size = inject(DECORATE_SIZE, ref({ width: 0, height: 0 }));
              return { size };
            },
            template: '<p>{{ size.width }} - {{ size.height }}</p>',
          },
        },
      },
    });

  test('should render an svg with size scaled down to 200 by (Y < 200)', () => {
    useFullStateSize.mockReturnValue(ref({ width: 500, height: 300 }));

    const { container } = generate();
    const svg = container.querySelector('svg');

    const width = svg.getAttribute('width');
    const height = svg.getAttribute('height');

    expect(width).toEqual('200');
    expect(height).toEqual('120');
  });

  test('should render an svg with size scaled down to (X < 200) by 200', () => {
    useFullStateSize.mockReturnValue(ref({ width: 400, height: 1000 }));

    const { container } = generate();
    const svg = container.querySelector('svg');

    const width = svg.getAttribute('width');
    const height = svg.getAttribute('height');

    expect(width).toEqual('80');
    expect(height).toEqual('200');
  });

  test('should provide dimensions in "canvas" to slotted component', () => {
    useFullStateSize.mockReturnValue(ref({ width: 500, height: 350 }));

    const { container } = generate();
    const paragraph = container.querySelector('svg p');

    expect(paragraph.innerText).toEqual('200 - 140');
  });
});
