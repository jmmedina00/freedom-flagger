import { describe, expect, test } from 'vitest';
import { render } from '@testing-library/vue';
import DecoratedFlagRenderer from './DecoratedFlagRenderer.vue';
import {
  DECORATE_COMPONENTS,
  DECORATE_MOSAIC,
} from '@app/components/shared/constant/rendering';
import { computed, inject } from 'vue';
import { DECORATE_CONFIG } from '@app/state';

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

  const generate = (props) =>
    render(DecoratedFlagRenderer, {
      props,
      global: {
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
    const { container } = generate({
      portions,
      direction: 'horizontal',
      decorateConfig: { foo: 'bar' },
    });

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
    const { container } = generate({
      portions,
      direction: 'horizontal',
      decorate: DECORATE_MOSAIC,
      decorateConfig: { foo: 'bar' },
    });

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
      const { container, findByText } = generate({
        portions,
        decorate,
        direction: 'vertical',
        decorateConfig: { foo: 'bar', bar: 'baz' },
      });

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
    const { queryByText } = generate({
      portions,
      direction: 'vertical',
      decorate: DECORATE_MOSAIC,
      decorateConfig: { foo: 'bar', bar: 'baz' },
    });

    const componentParagraph = queryByText('Component:', {
      exact: false,
    });
    expect(componentParagraph).toBeFalsy();
  });

  test('shoud not render decorate if there is a single portion', () => {
    const portions = [
      ['abc', 'cde', 'efg', 'qwe', 'asd', 'tre', 'poi', 'lkj', 'mnb'],
    ];
    const { queryByText } = generate({
      portions,
      direction: 'vertical',
      decorate: DECORATE_MOSAIC,
      decorateConfig: { foo: 'bar', bar: 'baz' },
    });

    const componentParagraph = queryByText('Component:', {
      exact: false,
    });
    expect(componentParagraph).toBeFalsy();
  });
});
