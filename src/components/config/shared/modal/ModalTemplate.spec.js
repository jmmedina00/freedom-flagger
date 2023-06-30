import { render } from '@testing-library/vue';
import { describe, expect } from 'vitest';
import ModalTemplate from './ModalTemplate.vue';
import { MODAL_ACTIVE } from '@app/state';
import { ref } from 'vue';

describe('ModalTemplate', () => {
  test('should not render anything if injected MODAL_ACTIVE is set to false', () => {
    const { container } = render(ModalTemplate, {
      global: { provide: { [MODAL_ACTIVE]: ref(false) } },
    });

    const modal = container.querySelector('.modal');
    expect(modal).toBeFalsy();
  });

  test('should render a background that triggers modal closing when clicked', () => {
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
    const { container } = render(ModalTemplate, {
      global: { provide: { [MODAL_ACTIVE]: ref(true) } },
      slots: { default: '<p>This is a test</p>' },
    });

    const content = container.querySelector('.modal p');
    expect(content.innerHTML).toEqual('This is a test');
  });
});
