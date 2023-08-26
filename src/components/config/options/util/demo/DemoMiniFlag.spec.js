import { render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import { inject, ref } from 'vue';
import { DECORATE_SIZE } from '@app/state';
import { useFullStateSize } from '@app/components/render/helper/size';
import { useAppropriateDemoSize } from './size';
import DemoMiniFlag from './DemoMiniFlag.vue';

vi.mock('@app/components/render/helper/size');
vi.mock('./size');

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

  test('should render an svg with size provided by demo scaling', () => {
    useFullStateSize.mockReturnValue(ref({ width: 500, height: 300 }));
    useAppropriateDemoSize.mockReturnValue(ref({ width: 3, height: 2 }));

    const { container } = generate();
    const svg = container.querySelector('svg');

    const width = svg.getAttribute('width');
    const height = svg.getAttribute('height');

    expect(width).toEqual('3');
    expect(height).toEqual('2');

    expect(useAppropriateDemoSize.mock.calls[0][0].value).toEqual({
      width: 500,
      height: 300,
    });
  });

  test('should provide dimensions in "canvas" to slotted component', () => {
    useFullStateSize.mockReturnValue(ref({ width: 500, height: 350 }));
    useAppropriateDemoSize.mockReturnValue(ref({ width: 4, height: 1 }));

    const { container } = generate();
    const paragraph = container.querySelector('svg p');

    expect(paragraph.innerText).toEqual('4 - 1');
  });
});
