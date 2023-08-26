import { fireEvent, render } from '@testing-library/vue';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { computed, inject, ref } from 'vue';
import {
  CONFIG_REMAINDER,
  DECORATE_CONFIG,
  HANDLING_CONFIG,
  MODAL_ACTIVE,
} from '@app/state';
import {
  REM_BORDER,
  REM_HEX,
  REM_MOSAIC,
  REM_TRIANGLE,
} from '@app/components/shared/constant/remainder';
import { placeColorsOnIndexes } from '@app/components/shared/color-index';
import { useFullStateSize } from '@app/components/render/helper/size';
import { useSomeConfig } from '../plugin';
import RemainingBytesModal from './RemainingBytesModal.vue';

vi.mock('@app/components/shared/color-index');
vi.mock('@app/components/render/helper/size');
vi.mock('../plugin');

describe('RemainingBytesModal', () => {
  const componentSetup = (value) => () => {
    const handling = inject(HANDLING_CONFIG);
    const set = () => {
      handling.value = { ...handling.value, ...value };
    };

    return {
      config: computed(() => JSON.stringify(handling.value.config)),
      set,
    };
  };

  const generate = ({ mosaic, corner, border, hex }, active = ref(true)) =>
    render(RemainingBytesModal, {
      global: {
        provide: {
          [MODAL_ACTIVE]: active,
        },
        mocks: {
          $t: (foo) => foo,
        },
        stubs: {
          MosaicSubpanel: {
            setup: componentSetup(mosaic),
            template:
              '<p><span>Mosaic: {{ config }}</span><button @click="set"></button></p>',
          },
          CornerTriangleSubpanel: {
            setup: componentSetup(corner),
            template:
              '<p><span>Triangle: {{ config }}</span><button @click="set"></button></p>',
          },
          BorderSubpanel: {
            setup: componentSetup(border),
            template:
              '<p><span>Border: {{ config }}</span><button @click="set"></button></p>',
          },
          HexSubpanel: {
            setup: componentSetup(hex),
            template:
              '<p><span>Hex: {{ config }}</span><button @click="set"></button></p>',
          },
          ModalTitle: {
            props: ['name'],
            setup: () => {
              const state = inject(HANDLING_CONFIG);
              const choices = computed(() => state.value.colorChoices);
              return { choices };
            },
            template: '<h1>Choices: {{ choices }}</h1>',
          },
          DemoMiniFlag: {
            props: ['component'],
            setup: () => {
              const config = inject(DECORATE_CONFIG);
              return { config };
            },
            template:
              '<p>Component: {{ component.__name }}</p><div>Config: {{ JSON.stringify(config) }}</div>',
          },
          IconOption: {
            props: ['id', 'icon', 'label', 'value', 'modelValue', 'disabled'],
            emits: ['update:modelValue'],
            template:
              '<label :for="id">{{ label }}</label>' +
              '<input name="test" type="radio" :id="id" :value="value" :checked="value === modelValue" ' +
              '@change="$emit(\'update:modelValue\', value)" :disabled="disabled"/>',
          },
        },
      },
    });

  const defaultGenerate = (active = ref(true)) =>
    generate(
      {
        mosaic: { config: { active: 12 } },
        corner: { config: { active: 23 } },
        border: { config: { active: 34 } },
        hex: { config: { active: 45 } },
      },
      active
    );

  beforeEach(() => {
    useFullStateSize.mockReturnValue(ref({ width: 500, height: 440 }));
    useSomeConfig.mockReturnValue(ref({ component: REM_BORDER, config: {} }));
    placeColorsOnIndexes.mockReturnValue({});
  });

  afterEach(() => {
    placeColorsOnIndexes.mockClear();
  });

  test('should provide initial value from state', async () => {
    useSomeConfig.mockReturnValue(
      ref({ component: REM_BORDER, config: { origin: 'state' } })
    );

    const { findByLabelText, findByText } = defaultGenerate();

    const option = await findByLabelText('config.decorate.' + REM_BORDER);
    expect(option.checked).toBeTruthy();

    const subSpan = await findByText('Border:', { exact: false });
    expect(subSpan.innerText).toEqual(
      'Border: ' + JSON.stringify({ origin: 'state' })
    );

    expect(useSomeConfig).toHaveBeenCalledWith(
      CONFIG_REMAINDER,
      expect.anything()
    );
  });

  test('should feed handling to mosaic subpanel and handle its changes', async () => {
    const { findByLabelText, findByText } = defaultGenerate();

    const option = await findByLabelText('config.decorate.' + REM_MOSAIC);
    await fireEvent.click(option);

    const subSpan = await findByText('Mosaic:', { exact: false });
    const subButton = subSpan.parentElement.querySelector('button');

    await fireEvent.click(subButton);
    expect(subSpan.innerText).toEqual(
      'Mosaic: ' + JSON.stringify({ active: 12 })
    );
  });

  test('should feed handling to corner subpanel and handle its changes', async () => {
    const { findByLabelText, findByText } = defaultGenerate();

    const option = await findByLabelText('config.decorate.' + REM_TRIANGLE);
    await fireEvent.click(option);

    const subSpan = await findByText('Triangle:', { exact: false });
    const subButton = subSpan.parentElement.querySelector('button');

    await fireEvent.click(subButton);
    expect(subSpan.innerText).toEqual(
      'Triangle: ' + JSON.stringify({ active: 23 })
    );
  });

  test('should feed handling to border subpanel and handle its changes', async () => {
    const { findByLabelText, findByText } = defaultGenerate();

    const option = await findByLabelText('config.decorate.' + REM_BORDER);
    await fireEvent.click(option);

    const subSpan = await findByText('Border:', { exact: false });
    const subButton = subSpan.parentElement.querySelector('button');

    await fireEvent.click(subButton);
    expect(subSpan.innerText).toEqual(
      'Border: ' + JSON.stringify({ active: 34 })
    );
  });

  test('should feed handling to border subpanel and handle its changes', async () => {
    const { findByLabelText, findByText } = defaultGenerate();

    const option = await findByLabelText('config.decorate.' + REM_HEX);
    await fireEvent.click(option);

    const subSpan = await findByText('Hex:', { exact: false });
    const subButton = subSpan.parentElement.querySelector('button');

    await fireEvent.click(subButton);
    expect(subSpan.innerText).toEqual('Hex: ' + JSON.stringify({ active: 45 }));
  });

  test('should feed mini flag with currently selected decorate', async () => {
    const { findByLabelText, findByText } = defaultGenerate();

    const mosaicOption = await findByLabelText('config.decorate.' + REM_MOSAIC);
    const cornerOption = await findByLabelText(
      'config.decorate.' + REM_TRIANGLE
    );
    const borderOption = await findByLabelText('config.decorate.' + REM_BORDER);

    await fireEvent.click(mosaicOption);
    const paragraph = await findByText('Component:', { exact: false });
    expect(paragraph.innerText).toEqual('Component: MosaicDecorate');

    await fireEvent.click(cornerOption);
    expect(paragraph.innerText).toEqual('Component: CornerTriangleDecorate');

    await fireEvent.click(borderOption);
    expect(paragraph.innerText).toEqual('Component: BorderDecorate');
  });

  test('should provide decorate config from adapted handling plus sample bytes', async () => {
    const handling = {
      config: { foo: 'bar' },
      adapted: ['foo'],
      proportional: ['re', 'la'],
    };

    placeColorsOnIndexes.mockReturnValue({ bar: 'baz' });

    const { findByLabelText, findByText } = generate({ corner: handling });
    const option = await findByLabelText('config.decorate.' + REM_TRIANGLE);
    await fireEvent.click(option);

    const paragraph = await findByText('Config:', { exact: false });
    const subButton = paragraph.parentElement.querySelector('button');
    await fireEvent.click(subButton);

    expect(paragraph.innerText).toEqual(
      'Config: ' + JSON.stringify({ bar: 'baz', bytes: [0, 0xff] })
    );

    expect(placeColorsOnIndexes).toHaveBeenCalledWith(
      { foo: 'bar' },
      {
        colors: expect.anything(),
        fields: ['foo'],
        scaled: ['re', 'la'],
        scaleRatio: 2 / 5,
      }
    );
  });

  test('should provide amount of color choices depending on toggle state', async () => {
    const { findByText, findByRole } = defaultGenerate();

    const checkbox = await findByRole('checkbox');
    expect(checkbox.checked).toBeFalsy();

    const title = await findByText('Choices:', { exact: false });
    expect(title.innerText).toEqual('Choices: 2');

    await fireEvent.click(checkbox);
    expect(title.innerText).toEqual('Choices: 3');
  });

  test('should apply all changes to state and close modal', async () => {
    const state = ref({ component: REM_BORDER, config: { origin: 'state' } });
    const active = ref(true);
    useSomeConfig.mockReturnValue(state);

    const { findByLabelText, findByText, findByRole } = defaultGenerate(active);
    const option = await findByLabelText('config.decorate.' + REM_TRIANGLE);
    await fireEvent.click(option);

    const checkbox = await findByRole('checkbox');
    await fireEvent.click(checkbox);
    await fireEvent.click(checkbox);

    const subSpan = await findByText('Triangle:', { exact: false });
    const subButton = subSpan.parentElement.querySelector('button');
    await fireEvent.click(subButton);

    const applyButton = await findByText('apply');
    await fireEvent.click(applyButton);

    expect(state.value).toEqual({
      component: REM_TRIANGLE,
      config: { active: 23 },
      colorChoices: 2,
    });
    expect(active.value).toBeFalsy();
  });
});
