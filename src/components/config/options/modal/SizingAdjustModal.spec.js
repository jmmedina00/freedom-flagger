import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import SizingAdjustModal from './SizingAdjustModal.vue';
import { computed, ref } from 'vue';
import { useSomeConfig } from '../plugin';
import { CONFIG_SIZING, MODAL_ACTIVE } from '@app/state';
import { useCalculatedSizes } from '../../../shared/sizing';

vi.mock('../plugin');
vi.mock('../../../shared/sizing');

describe('SizingAdjustModal', () => {
  const ORIENT_VERTICAL = 'swap_vert';
  const ORIENT_HORIZONTAL = 'swap_horiz';

  useCalculatedSizes.mockReturnValue(ref({ width: 1, height: 2 }));

  const generate = () => {
    const isActive = ref(true);

    const rendered = render(SizingAdjustModal, {
      global: {
        provide: { [MODAL_ACTIVE]: isActive },
        mocks: { $t: (foo) => foo },
        stubs: {
          IconOption: {
            props: ['id', 'icon', 'label', 'value', 'modelValue', 'disabled'],
            emits: ['update:modelValue'],
            template:
              '<label :for="id" v-bind="$attrs">{{ label }}</label>' +
              '<input name="test" type="radio" :id="id" :value="value" :checked="value === modelValue" ' +
              '@change="$emit(\'update:modelValue\', value)" :disabled="disabled"/>',
          },
          IconButton: {
            props: ['icon'],
            template: '<button>{{ icon }}</button>',
          }, // StrictNumberInput not really mocked, hopefully I don't regret it...
          ModalTitle: {
            template: '<span></span>',
          },
        },
      },
    });

    return { rendered, isActive };
  };

  test('should start as horizontally oriented when config reports aspect ratio X is greater than Y', () => {
    const startingPoint = ref({
      width: 400,
      height: undefined,
      aspectRatio: { x: 4, y: 3 },
    });

    useSomeConfig.mockReturnValue(startingPoint);

    const {
      rendered: { queryByText },
    } = generate();

    expect(useSomeConfig).toHaveBeenCalledWith(
      CONFIG_SIZING,
      expect.anything()
    );

    const button = queryByText(ORIENT_HORIZONTAL);
    expect(button).toBeTruthy();
  });

  test('should start as horizontally oriented when config has both dimensions and no aspect ratio', () => {
    const startingPoint = ref({
      width: 400,
      height: 200,
      aspectRatio: null,
    });

    useSomeConfig.mockReturnValue(startingPoint);

    const {
      rendered: { queryByText },
    } = generate();

    expect(useSomeConfig).toHaveBeenCalledWith(
      CONFIG_SIZING,
      expect.anything()
    );

    const button = queryByText(ORIENT_HORIZONTAL);
    expect(button).toBeTruthy();
  });

  test('should start as vertically oriented when config reports aspect ratio X is lower than Y', () => {
    const startingPoint = ref({
      width: 400,
      height: undefined,
      aspectRatio: { y: 4, x: 3 },
    });

    useSomeConfig.mockReturnValue(startingPoint);

    const {
      rendered: { queryByText },
    } = generate();

    const button = queryByText(ORIENT_VERTICAL);
    expect(button).toBeTruthy();
  });

  test('should provide calculated height in placeholder when only width is populated for defined ratio', () => {
    const startingPoint = ref({
      width: 400,
      height: undefined,
      aspectRatio: { x: 4, y: 3 },
    });

    useSomeConfig.mockReturnValue(startingPoint);
    useCalculatedSizes.mockReturnValue(ref({ width: 400, height: 200 }));

    const {
      rendered: { queryByPlaceholderText },
    } = generate();

    const input = queryByPlaceholderText('200');
    expect(input).toBeTruthy();
  });

  test('should provide calculated width in placeholder when only height is populated for defined ratio', () => {
    const startingPoint = ref({
      width: undefined,
      height: 200,
      aspectRatio: { x: 4, y: 3 },
    });

    useSomeConfig.mockReturnValue(startingPoint);
    useCalculatedSizes.mockReturnValue(ref({ width: 400, height: 200 }));

    const {
      rendered: { queryByPlaceholderText },
    } = generate();

    const input = queryByPlaceholderText('400');
    expect(input).toBeTruthy();
  });

  test('should provided up to date missing dimension when ratio orientation changes', async () => {
    const startingPoint = ref({
      width: undefined,
      height: 200,
      aspectRatio: { x: 4, y: 3 },
    });

    useSomeConfig.mockReturnValue(startingPoint);
    useCalculatedSizes.mockImplementation((currentValue) =>
      computed(() =>
        currentValue.value.aspectRatio.x === 4
          ? { width: 400, height: 200 }
          : { width: 100, height: 200 }
      )
    );

    const {
      rendered: {
        queryByPlaceholderText,
        queryByLabelText,
        queryByText,
        container,
      },
    } = generate();

    const button = queryByText(ORIENT_HORIZONTAL);
    expect(button).toBeTruthy();

    const emptyInput = queryByPlaceholderText('400');
    expect(emptyInput.placeholder).toEqual('400');

    const ratioOption = queryByLabelText('4:3');
    expect(ratioOption.checked).toBeTruthy();

    await fireEvent.click(button);
    expect(emptyInput.placeholder).toEqual('100');
    expect(ratioOption.checked).toBeTruthy();
    expect(button.innerText).toEqual(ORIENT_VERTICAL);
  });

  test('should provide up to date missing dimension when populated dimension changes', async () => {
    const startingPoint = ref({
      width: undefined,
      height: 200,
      aspectRatio: { x: 4, y: 3 },
    });

    useSomeConfig.mockReturnValue(startingPoint);
    useCalculatedSizes.mockImplementation((currentValue) =>
      computed(() =>
        currentValue.value.height === 200
          ? { width: 400, height: 200 }
          : { width: 500, height: 300 }
      )
    );

    const {
      rendered: { queryByPlaceholderText },
    } = generate();

    const populatedInput = queryByPlaceholderText('200');
    const emptyInput = queryByPlaceholderText('400');
    expect(emptyInput.placeholder).toEqual('400');

    await fireEvent.update(populatedInput, 300);
    expect(emptyInput.placeholder).toEqual('500');
  });

  test('should change orientation to custom and lock other ratios automatically when missing dimension is populated', async () => {
    const expectedLabels = ['3:2', '5:3', '4:3', '16:9', '1:1'];

    const startingPoint = ref({
      width: 400,
      height: undefined,
      aspectRatio: { x: 4, y: 3 },
    });
    useSomeConfig.mockReturnValue(startingPoint);
    useCalculatedSizes.mockReturnValue(ref({ width: 400, height: 200 }));

    const {
      rendered: { queryByPlaceholderText, queryByLabelText },
    } = generate();

    const emptyInput = queryByPlaceholderText('200');
    const customOption = queryByLabelText('options.custom.long');

    await fireEvent.update(emptyInput, 100);
    expect(customOption.checked).toBeTruthy();

    for (const label of expectedLabels) {
      const option = queryByLabelText(label);
      expect(option.checked).toBeFalsy();
      expect(option.disabled).toBeTruthy();
    }
  });

  test('should allow click on apply button when aspect ratio and at least one dimension is defined', async () => {
    const startingPoint = ref({
      width: undefined,
      height: 200,
      aspectRatio: { x: 4, y: 3 },
    });

    useSomeConfig.mockReturnValue(startingPoint);
    useCalculatedSizes.mockReturnValue(ref({ width: 400, height: 200 }));

    const {
      rendered: { queryByPlaceholderText, queryByLabelText, queryByText },
    } = generate();

    const populatedInput = queryByPlaceholderText('200');
    await fireEvent.update(populatedInput, 300);

    const interestingOption = queryByLabelText('16:9');
    await fireEvent.click(interestingOption);

    const applyButton = queryByText('common.apply');
    expect(applyButton.disabled).toBeFalsy();

    expect(startingPoint.value).toEqual({
      width: undefined,
      height: 200,
      aspectRatio: { x: 4, y: 3 },
    }); // Assert starting point hasn't been changed
  });

  test('should allow click on apply button when both dimensions are defined', async () => {
    const startingPoint = ref({
      width: undefined,
      height: 200,
      aspectRatio: { x: 4, y: 3 },
    });

    useSomeConfig.mockReturnValue(startingPoint);
    useCalculatedSizes.mockReturnValue(ref({ width: 400, height: 200 }));

    const {
      rendered: { queryByPlaceholderText, queryByText },
    } = generate();

    const emptyInput = queryByPlaceholderText('400');
    await fireEvent.update(emptyInput, 300);

    const applyButton = queryByText('common.apply');
    expect(applyButton.disabled).toBeFalsy();
  });

  test('should not allow click on apply button when missing a dimension and aspect ratio', async () => {
    const startingPoint = ref({
      width: undefined,
      height: 200,
      aspectRatio: { x: 4, y: 3 },
    });

    useSomeConfig.mockReturnValue(startingPoint);
    useCalculatedSizes.mockImplementation(
      (currentValue) =>
        computed(() =>
          !!currentValue.value.aspectRatio ? { width: 400, height: 200 } : {}
        ) // Relies on calculated sizes to determine validity
    );

    const {
      rendered: { queryByPlaceholderText, queryByLabelText, queryByText },
    } = generate();

    const populatedInput = queryByPlaceholderText('200');
    await fireEvent.update(populatedInput, '');

    const interestingOption = queryByLabelText('options.custom.long');
    await fireEvent.click(interestingOption);

    const applyButton = queryByText('common.apply');
    expect(applyButton.disabled).toBeTruthy();
  });

  test('should apply edited config to stored config upon clicking apply button', async () => {
    const startingPoint = ref({
      width: undefined,
      height: 200,
      aspectRatio: { x: 4, y: 3 },
    });

    useSomeConfig.mockReturnValue(startingPoint);
    useCalculatedSizes.mockReturnValue(ref({ width: 400, height: 200 }));

    const {
      rendered: { queryByPlaceholderText, queryByLabelText, queryByText },
      isActive,
    } = generate();

    const populatedInput = queryByPlaceholderText('200');
    await fireEvent.update(populatedInput, 300);

    const interestingOption = queryByLabelText('16:9');
    await fireEvent.click(interestingOption);

    const applyButton = queryByText('common.apply');
    await fireEvent.click(applyButton);

    expect(startingPoint.value).toEqual({
      width: undefined,
      height: 300,
      aspectRatio: { x: 16, y: 9 },
    });
    expect(isActive.value).toBeFalsy();
  });
});
