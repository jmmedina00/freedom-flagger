import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import { computed, inject, ref } from 'vue';
import { HANDLING_CONFIG } from '@app/state';
import {
  DECORATE_INFINITE,
  DECORATE_MOSAIC,
  DECORATE_SHAPE,
  RENDERER_DECORATE,
} from '@app/components/shared/constant/rendering';
import { useDefaultedConfig } from './common/default';
import DecorateSubpanel from './DecorateSubpanel.vue';

vi.mock('./common/default');

describe('DecorateSubpanel', () => {
  const SUBPANELS = {
    [DECORATE_MOSAIC]: 'MosaicSubpanel',
    [DECORATE_INFINITE]: 'InfiniteSubpanel',
    [DECORATE_SHAPE]: 'ShapeSubpanel',
  };

  const autoStubs = Object.fromEntries(
    Object.entries(SUBPANELS).map(([key, component]) => [
      component,
      {
        setup: (props) => {
          const handling = inject(HANDLING_CONFIG, ref({}));

          const setValue = () => {
            handling.value = {
              ...handling.value,
              config: { value: key, test: key.length * 3 + 2 },
              garbage: 'value',
              proportional: ['test'],
            };
          };

          return {
            config: computed(() => JSON.stringify(handling.value?.config)),
            setValue,
          };
        },
        template: `<p>${component}: {{ config }}</p><button @click="setValue">Click</button>`,
      },
    ])
  );

  const generate = () =>
    render(DecorateSubpanel, {
      global: {
        stubs: {
          ...autoStubs,
          IconOption: {
            props: ['id', 'icon', 'label', 'value', 'modelValue', 'disabled'],
            emits: ['update:modelValue'],
            template:
              '<label :for="id" v-bind="$attrs">{{ label }}</label>' +
              '<input name="test" type="radio" :id="id" :value="value" :checked="value === modelValue" ' +
              '@change="$emit(\'update:modelValue\', value)" :disabled="disabled"/>',
          },
        },
        mocks: { $t: (foo) => foo },
      },
    });

  test('should provide initial value from state', async () => {
    const config = ref({
      decorate: DECORATE_INFINITE,
      decorateConfig: { foo: 'bar', re: 12 },
    });
    useDefaultedConfig.mockReturnValue(config);

    const { findByText, findByLabelText } = generate();

    const expectedOption = await findByLabelText(
      'decorate.' + DECORATE_INFINITE
    );
    expect(expectedOption.checked).toBeTruthy();

    const paragraph = await findByText('InfiniteSubpanel', { exact: false });
    expect(paragraph.innerText).toEqual(
      'InfiniteSubpanel: ' + JSON.stringify({ foo: 'bar', re: 12 })
    );

    expect(useDefaultedConfig).toHaveBeenCalledWith(
      RENDERER_DECORATE,
      expect.anything()
    );
  });

  test.each(Object.entries(SUBPANELS))(
    'should allow to select %s decorate and get clean changes from %s',
    async (decorate, component) => {
      const config = ref({
        decorate: Object.keys(SUBPANELS).filter((d) => d !== decorate)[0],
        decorateConfig: { foo: 'bar', re: 12 },
      });

      useDefaultedConfig.mockReturnValue(config);

      const { findByText, findByLabelText } = generate();

      const option = await findByLabelText('decorate.' + decorate);
      await fireEvent.click(option);

      const clickButton = await findByText('Click');
      await fireEvent.click(clickButton);

      const goodParagraph = await findByText(component, { exact: false });
      expect(goodParagraph.innerText).toEqual(
        `${component}: ${JSON.stringify({
          value: decorate,
          test: decorate.length * 3 + 2,
        })}`
      );

      expect(config.value).toEqual({
        decorate,
        decorateConfig: { value: decorate, test: decorate.length * 3 + 2 },
        scale: ['test'],
      });
    }
  );
});
