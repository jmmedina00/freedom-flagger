import { fireEvent, render } from '@testing-library/vue';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { computed, inject, ref } from 'vue';
import { DECORATE_CONFIG, HANDLING_CONFIG } from '@app/state';
import {
  REM_BORDER,
  REM_MOSAIC,
  REM_TRIANGLE,
} from '@app/components/shared/constant/remainder';
import { placeColorsOnIndexes } from '@app/components/shared/color-index';
import { useFullStateSize } from '@app/components/render/helper/size';
import RemainingBytesModal from './RemainingBytesModal.vue';

vi.mock('@app/components/shared/color-index');
vi.mock('@app/components/render/helper/size');

describe('RemainingBytesModal', () => {
  const componentSetup = (value) => () => {
    const handling = inject(HANDLING_CONFIG);
    const set = () => {
      handling.value = value;
    };

    return { config: computed(() => JSON.stringify(handling.value)), set };
  };

  const generate = ({ mosaic, corner, border }) =>
    render(RemainingBytesModal, {
      global: {
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
          ModalTitle: {
            props: ['name'],
            template: '<h1>{{ name }}</h1>',
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

  const defaultGenerate = () =>
    generate({
      mosaic: { active: 12 },
      corner: { active: 23 },
      border: { active: 34 },
    });

  beforeEach(() => {
    useFullStateSize.mockReturnValue(ref({ width: 500, height: 440 }));
  });

  afterEach(() => {
    placeColorsOnIndexes.mockClear();
  });

  test.skip('should provide initial value from state', () => {});

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

  test('should provide decorate config from adapted handling', async () => {
    const handling = {
      config: { foo: 'bar' },
      adapted: ['foo'],
      proportional: [],
    };

    placeColorsOnIndexes.mockReturnValue({ bar: 'baz' });

    const { findByLabelText, findByText } = generate({ corner: handling });
    const option = await findByLabelText('config.decorate.' + REM_TRIANGLE);
    await fireEvent.click(option);

    const paragraph = await findByText('Config:', { exact: false });
    const subButton = paragraph.parentElement.querySelector('button');
    await fireEvent.click(subButton);

    expect(paragraph.innerText).toEqual(
      'Config: ' + JSON.stringify({ bar: 'baz' })
    );

    expect(placeColorsOnIndexes).toHaveBeenCalledWith(
      { foo: 'bar' },
      { colors: expect.anything(), fields: ['foo'] }
    );
  });

  test('should append colors to handling if it does not need to be adapted', async () => {
    const handling = {
      config: { foo: 'bar' },
      adapted: [],
      proportional: [],
    };

    placeColorsOnIndexes.mockReturnValue({ wrong: 'value' });

    const { findByLabelText, findByText } = generate({ border: handling });
    const option = await findByLabelText('config.decorate.' + REM_BORDER);
    await fireEvent.click(option);

    const paragraph = await findByText('Config:', { exact: false });
    const subButton = paragraph.parentElement.querySelector('button');
    await fireEvent.click(subButton);

    const parsed = JSON.parse(paragraph.innerText.replace('Config: ', ''));
    expect(parsed).toEqual({ foo: 'bar', colors: expect.anything() });

    expect(placeColorsOnIndexes).not.toHaveBeenCalled();
  });

  test('should provide decorate config from scaled handling', async () => {
    const handling = {
      config: { foo: 'bar' },
      adapted: ['foo'],
      proportional: ['re', 'la'],
    };

    placeColorsOnIndexes.mockReturnValue({
      re: 200,
      la: 350,
      shi: 23,
      car: 'qwe',
    });

    const { findByLabelText, findByText } = generate({ corner: handling });
    const option = await findByLabelText('config.decorate.' + REM_TRIANGLE);
    await fireEvent.click(option);

    const paragraph = await findByText('Config:', { exact: false });
    const subButton = paragraph.parentElement.querySelector('button');
    await fireEvent.click(subButton);

    expect(paragraph.innerText).toEqual(
      'Config: ' + JSON.stringify({ re: 80, la: 140, shi: 23, car: 'qwe' })
    );
  });

  test.skip('should apply all changes to state', () => {});
});
