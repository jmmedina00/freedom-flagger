import { render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import RenderPanel from './RenderPanel.vue';
import { useFullStateSize } from './helper/size';
import { ref } from 'vue';
import { useElementSize } from '@vueuse/core';
import { useCalculatedSizes } from '../shared/sizing';

vi.mock('@vueuse/core');
vi.mock('./helper/size');
vi.mock('../shared/sizing');

describe('RenderPanel', () => {
  const generate = () =>
    render(RenderPanel, {
      global: {
        stubs: {
          FlagDisplay: { template: '<div class="flag">Flag here</div>' },
          ExitButton: { template: '<button></button>' },
        },
      },
    });

  test("should apply horizontal class if flag isn't too tall for panel", () => {
    useFullStateSize.mockReturnValue(ref({ width: 300, height: 200 }));
    useElementSize.mockReturnValue({ width: ref(500), height: ref(400) });
    useCalculatedSizes.mockReturnValue(ref({ width: 500, height: 350 }));

    const { container } = generate();
    expect(container.querySelector('.flag.horizontal').innerText).toEqual(
      'Flag here'
    );
    expect(container.querySelector('.flag.vertical')).toBeFalsy();
  });

  test('should apply vertical class if flag is too tall for panel', () => {
    useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
    useElementSize.mockReturnValue({ width: ref(500), height: ref(400) });
    useCalculatedSizes.mockReturnValue(ref({ width: 500, height: 800 }));

    const { container } = generate();
    expect(container.querySelector('.flag.vertical').innerText).toEqual(
      'Flag here'
    );
    expect(container.querySelector('.flag.horizontal')).toBeFalsy();
  });
});
