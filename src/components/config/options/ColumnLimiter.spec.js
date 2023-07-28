import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import ColumnLimiter from './ColumnLimiter.vue';
import { useSomeConfig } from './plugin';
import { ref } from 'vue';
import { CONFIG_MAX_COLUMNS } from '@app/state';

vi.mock('./plugin');

describe('ColumnLimiter', () => {
  const generate = () =>
    render(ColumnLimiter, {
      global: {
        stubs: {
          LimitedSliderNumber: {
            emits: ['update:modelValue'],
            props: ['modelValue'],
            template: '<span>slider</span>',
          },
        },
        mocks: {
          $t: (foo) => foo,
        },
      },
    });

  test('should have toggle enabled and show slider at first when column max is defined', async () => {
    useSomeConfig.mockReturnValue(ref(11));

    const { findByRole, queryByText } = generate();
    const toggle = await findByRole('checkbox');
    expect(toggle.checked).toBeTruthy();

    expect(queryByText('slider')).toBeTruthy();
    expect(useSomeConfig).toHaveBeenCalledWith(CONFIG_MAX_COLUMNS);
  });

  test('should unset column max and remove slider when toggle is switched off', async () => {
    const columns = ref(11);
    useSomeConfig.mockReturnValue(columns);

    const { findByRole, queryByText } = generate();
    const toggle = await findByRole('checkbox');

    await fireEvent.click(toggle);

    expect(columns.value).toBeFalsy();
    expect(queryByText('slider')).toBeFalsy();
  });

  test('should have toggle disabled at first and no slider when column max is undefined', async () => {
    useSomeConfig.mockReturnValue(ref(null));

    const { findByRole, queryByText } = generate();
    const toggle = await findByRole('checkbox');
    expect(toggle.checked).toBeFalsy();

    expect(queryByText('slider')).toBeFalsy();
  });

  test('should set column to 12 as default and show slider when toggle is switched on', async () => {
    const columns = ref(null);
    useSomeConfig.mockReturnValue(columns);

    const { findByRole, queryByText } = generate();
    const toggle = await findByRole('checkbox');

    await fireEvent.click(toggle);

    expect(columns.value).toBeTruthy();
    expect(queryByText('slider')).toBeTruthy();
  });
});
