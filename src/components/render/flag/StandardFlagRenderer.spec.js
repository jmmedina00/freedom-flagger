import { render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import StandardFlagRenderer from './StandardFlagRenderer.vue';
import { ref } from 'vue';

describe('StandardFlagRenderer', () => {
  test('should draw all portions at the same provided direction', () => {
    const portions = ref([
      ['foo', 'bar', 'baz'],
      ['re', 'la'],
    ]);
    const direction = ref('horizontal');

    const { container } = render(StandardFlagRenderer, {
      props: { portions, direction },
      global: {
        stubs: {
          FlagPortion: {
            props: ['colors', 'index', 'total', 'direction'],
            template:
              '<rect>{{ colors.toString() }} - {{ index }} - {{ total }} - {{ direction }}</rect>',
          },
        },
      },
    });

    const rects = container.querySelectorAll('rect');
    const texts = [...rects].map((foo) => foo.innerHTML);

    expect(texts).toEqual([
      'foo,bar,baz - 0 - 2 - horizontal',
      're,la - 1 - 2 - horizontal',
    ]);
  });
});
