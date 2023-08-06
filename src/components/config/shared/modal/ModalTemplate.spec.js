import { render } from '@testing-library/vue';
import { afterEach, describe, expect, test, vi } from 'vitest';
import ModalTemplate from './ModalTemplate.vue';
import { MODAL_ACTIVE } from '@app/state';
import { nextTick, ref } from 'vue';
import { useFocusTrap } from '@vueuse/integrations/useFocusTrap';

vi.mock('@vueuse/integrations/useFocusTrap');

describe('ModalTemplate', () => {
  const getMockedTrap = () => {
    const activate = vi.fn();
    const deactivate = vi.fn();

    useFocusTrap.mockReturnValue({ activate, deactivate });
    return { activate, deactivate };
  };

  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should not render anything if injected MODAL_ACTIVE is set to false', () => {
    getMockedTrap();

    const { container } = render(ModalTemplate, {
      global: { provide: { [MODAL_ACTIVE]: ref(false) } },
    });

    const modal = container.querySelector('.modal');
    expect(modal).toBeFalsy();
  });

  test('should render a background that triggers modal closing when clicked', () => {
    getMockedTrap();
    const active = ref(true);

    const { container } = render(ModalTemplate, {
      global: { provide: { [MODAL_ACTIVE]: active } },
    });

    const background = container.querySelector('.modal .modal-background');

    expect(active.value).toBeTruthy();
    background.click();
    expect(active.value).toBeFalsy();
  });

  test('should render slot withing modal container as-is', () => {
    getMockedTrap();

    const { container } = render(ModalTemplate, {
      global: { provide: { [MODAL_ACTIVE]: ref(true) } },
      slots: { default: '<p>This is a test</p>' },
    });

    const content = container.querySelector('.modal p');
    expect(content.innerHTML).toEqual('This is a test');
  });

  test('should enable focus trap when modal becomes active', async () => {
    const { activate, deactivate } = getMockedTrap();
    const active = ref(false);

    const { container } = render(ModalTemplate, {
      global: { provide: { [MODAL_ACTIVE]: active } },
    });

    active.value = true;
    await new Promise((resolve) => setImmediate(() => resolve())); // Force test to wait for nextTick

    expect(activate).toHaveBeenCalled();
    expect(deactivate).not.toHaveBeenCalled();
  });

  test('should disable focus trap when modal becomes inactive', async () => {
    const { activate, deactivate } = getMockedTrap();
    const active = ref(true);

    const { container } = render(ModalTemplate, {
      global: { provide: { [MODAL_ACTIVE]: active } },
    });

    active.value = false;
    await Promise.resolve();

    expect(deactivate).toHaveBeenCalled();
    expect(activate).not.toHaveBeenCalled();
  });
});
