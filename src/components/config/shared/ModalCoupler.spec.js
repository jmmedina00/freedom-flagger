import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import ModalCoupler from './ModalCoupler.vue';
import { computed, inject, ref } from 'vue';
import { MODAL_ACTIVE } from '../../../state';

describe('ModalCoupler', () => {
  const generate = (props = {}, slots = {}) =>
    render(ModalCoupler, {
      props,
      slots,
      global: {
        mocks: {
          $t: (foo) => foo,
        },
        stubs: {
          ModalTemplate: {
            template: '<div class="dismodal"><slot></slot></div>',
          },
        },
      },
    });

  const checkOnActive = {
    default: {
      setup: () => {
        const active = inject(MODAL_ACTIVE);
        const reactive = computed(() => active.value);

        return { active: reactive };
      },
      template: '<p>{{active}}</p>',
    },
  };

  test('should provide generic button that launches modal', async () => {
    const { findByRole, queryByText } = generate({}, checkOnActive);

    const button = await findByRole('button');

    expect(queryByText('false')).toBeTruthy();
    expect(queryByText('true')).toBeNull();

    await fireEvent.click(button);

    expect(queryByText('true')).toBeTruthy();
    expect(queryByText('false')).toBeNull();
  });

  test('should prevent generic button from launching if enabled is explicitly set to false', async () => {
    const { findByRole, queryByText } = generate(
      { enabled: false },
      checkOnActive
    );

    const button = await findByRole('button');

    expect(queryByText('false')).toBeTruthy();
    expect(queryByText('false').tagName).toBe('P');
    expect(queryByText('true')).toBeNull();

    await fireEvent.click(button);

    expect(queryByText('false')).toBeTruthy();
    expect(queryByText('true')).toBeNull();
  });

  test('should prevent generic button from launching if enabled is explicitly set to false with ref', async () => {
    const { findByRole, queryByText } = generate(
      { enabled: ref(false) },
      checkOnActive
    );

    const button = await findByRole('button');

    expect(queryByText('false')).toBeTruthy();
    expect(queryByText('false').tagName).toBe('P');
    expect(queryByText('true')).toBeNull();

    await fireEvent.click(button);

    expect(queryByText('false')).toBeTruthy();
    expect(queryByText('true')).toBeNull();
  });

  // Unable to test button in slot

  /* test('should provide launch modal trigger to button in slot', () => {});

  test('should prevent button in slot from launching modal if enabled is explicitly set to false', () => {}); */

  test('should provide generic modal if no modal is provided', () => {
    const { container } = generate();

    const box = container.querySelector('.dismodal .modal-content .box');
    expect(box.innerHTML).toEqual('missingModal');
  });

  test('should provide generic modal based on label if no modal is provided', () => {
    const { container } = generate({ label: 'khe' });

    const box = container.querySelector('.dismodal .modal-content .box');
    expect(box.innerHTML).toEqual('khe');
  });
});
