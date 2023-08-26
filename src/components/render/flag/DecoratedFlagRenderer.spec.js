import { describe, expect, test } from 'vitest';
import { render } from '@testing-library/vue';
import DecoratedFlagRenderer from './DecoratedFlagRenderer.vue';
import {
  DECORATE_COMPONENTS,
  DECORATE_MOSAIC,
} from '@app/components/shared/constant/rendering';
import { computed, inject, ref } from 'vue';
import { DECORATE_CONFIG, RENDER_BASICS, RENDER_PARAMS } from '@app/state';

describe('DecoratedFlagRenderer', () => {
  const possibleDecorates = Object.keys(DECORATE_COMPONENTS);
  const autoStubs = Object.fromEntries(
    Object.entries(DECORATE_COMPONENTS).map(([key, component]) => [
      component.__name,
      {
        setup: () => {
          const config = inject(DECORATE_CONFIG);
          return { config: computed(() => JSON.stringify(config?.value)) };
        },
        template: `<p>Component: ${key}</p><p>Config: {{ config }}</p>`,
      },
    ])
  );

  const generate = (provide) =>
    render(DecoratedFlagRenderer, {
      global: {
        provide,
        stubs: {
          FlagPortion: {
            props: ['colors', 'index', 'total', 'direction'],
            template:
              '<rect>{{ colors.toString() }} - {{ index }} - {{ total }} - {{ direction }}</rect>',
          },
          ...autoStubs,
        },
      },
    });

  test('should draw all complete portions normally', () => {
    const portions = [
      ['abc', 'cde', 'efg'],
      ['qwe', 'asd', 'tre'],
      ['poi', 'lkj', 'mnb'],
      ['wut', 'is'],
    ];

    const provide = {
      [RENDER_BASICS]: {
        portions: ref(portions),
        direction: ref('horizontal'),
      },
      [RENDER_PARAMS]: ref({
        decorate: DECORATE_MOSAIC,
        decorateConfig: { foo: 'bar' },
      }),
    };
    const { container } = generate(provide);

    const rects = container.querySelectorAll('rect');
    const texts = [...rects].map((rect) => rect.innerHTML);

    expect(texts).toEqual([
      'abc,cde,efg - 0 - 3 - horizontal',
      'qwe,asd,tre - 1 - 3 - horizontal',
      'poi,lkj,mnb - 2 - 3 - horizontal',
    ]);
  });

  test('should draw all portions normally', () => {
    const portions = [
      ['abc', 'cde', 'efg'],
      ['qwe', 'asd', 'tre'],
      ['poi', 'lkj', 'mnb'],
      ['wut', 'is', 'this'],
    ];

    const provide = {
      [RENDER_BASICS]: {
        portions: ref(portions),
        direction: ref('horizontal'),
      },
      [RENDER_PARAMS]: ref({
        decorate: DECORATE_MOSAIC,
        decorateConfig: { foo: 'bar' },
      }),
    };
    const { container } = generate(provide);

    const rects = container.querySelectorAll('rect');
    const texts = [...rects].map((rect) => rect.innerHTML);

    expect(texts).toEqual([
      'abc,cde,efg - 0 - 4 - horizontal',
      'qwe,asd,tre - 1 - 4 - horizontal',
      'poi,lkj,mnb - 2 - 4 - horizontal',
      'wut,is,this - 3 - 4 - horizontal',
    ]);
  });

  test.each(possibleDecorates)(
    'should send last, incomplete row to decorate %s along with config',
    async (decorate) => {
      const portions = [
        ['abc', 'cde', 'efg'],
        ['qwe', 'asd', 'tre'],
        ['poi', 'lkj', 'mnb'],
        ['wut', 'is'],
      ];

      const provide = {
        [RENDER_BASICS]: {
          portions: ref(portions),
          direction: ref('vertical'),
        },
        [RENDER_PARAMS]: ref({
          decorate,
          decorateConfig: { foo: 'bar', bar: 'baz' },
        }),
      };
      const { findByText } = generate(provide);

      const componentParagraph = await findByText('Component:', {
        exact: false,
      });
      expect(componentParagraph.innerText).toEqual('Component: ' + decorate);

      const configParagraph = await findByText('Config:', { exact: false });
      expect(configParagraph.innerText).toEqual(
        'Config: ' +
          JSON.stringify({ foo: 'bar', bar: 'baz', colors: ['wut', 'is'] })
      );
    }
  );

  test('should skip rendering decorate if there is no incomplete portion', async () => {
    const portions = [
      ['abc', 'cde', 'efg'],
      ['qwe', 'asd', 'tre'],
      ['poi', 'lkj', 'mnb'],
      ['wut', 'is', 'this'],
    ];

    const provide = {
      [RENDER_BASICS]: {
        portions: ref(portions),
        direction: ref('vertical'),
      },
      [RENDER_PARAMS]: ref({
        decorate: DECORATE_MOSAIC,
        decorateConfig: { foo: 'bar', bar: 'baz' },
      }),
    };
    const { queryByText } = generate(provide);

    const componentParagraph = queryByText('Component:', {
      exact: false,
    });
    expect(componentParagraph).toBeFalsy();
  });

  test('shoud not render decorate if there is a single portion', () => {
    const portions = [
      ['abc', 'cde', 'efg', 'qwe', 'asd', 'tre', 'poi', 'lkj', 'mnb'],
    ];

    const provide = {
      [RENDER_BASICS]: {
        portions: ref(portions),
        direction: ref('vertical'),
      },
      [RENDER_PARAMS]: ref({
        decorate: DECORATE_MOSAIC,
        decorateConfig: { foo: 'bar', bar: 'baz' },
      }),
    };
    const { queryByText } = generate(provide);

    const componentParagraph = queryByText('Component:', {
      exact: false,
    });
    expect(componentParagraph).toBeFalsy();
  });
});
