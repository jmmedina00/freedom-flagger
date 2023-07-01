import { describe, expect, test } from 'vitest';
import { NOTIFICATION } from '../../state';
import NotificationBlock from './NotificationBlock.vue';
import { fireEvent, render } from '@testing-library/vue';
import { ref } from 'vue';

describe('NotificationBlock', () => {
  const generate = (notification) =>
    render(NotificationBlock, {
      global: {
        mocks: {
          $t: (foo) => foo,
        },
        provide: { [NOTIFICATION]: ref(notification) },
      },
    });

  test('should not display at all if no notification is currently set', () => {
    const { container } = generate(null);

    const notification = container.querySelector('.notification');
    expect(notification).toBeFalsy();
  });

  test('should display with default "primary" color if provided data is a simple string', () => {
    const { container } = generate('This is a test');

    const notification = container.querySelector('.notification');
    const classes = [...notification.classList.values()];

    expect(classes).toEqual(['notification', 'is-primary']);
    expect(notification.innerText.trim()).toEqual('This is a test');
  });

  test('should display with a certain color and a certain message', () => {
    const { container } = generate({ color: 'link', message: 'Test me' });

    const notification = container.querySelector('.notification');
    const classes = [...notification.classList.values()];

    expect(classes).toEqual(['notification', 'is-link']);
    expect(notification.innerText.trim()).toEqual('Test me');
  });

  test('should display with fine-grained styles if provided with a complex color', () => {
    const { container } = generate({ color: 'link-dark', message: 'Test me' });

    const notification = container.querySelector('.notification');
    const classes = [...notification.classList.values()];
    expect(classes).toEqual(['notification', 'is-link', 'is-dark']);
  });

  test('should be able to be "closed" by clicking the "delete" button', async () => {
    const notification = ref({ color: 'link-dark', message: 'Test me' });

    const { findByRole } = generate(notification);

    const button = await findByRole('button');
    expect([...button.classList.values()]).toEqual(['delete']);

    await fireEvent.click(button);
    expect(notification.value).toBeNull();
  });
});
