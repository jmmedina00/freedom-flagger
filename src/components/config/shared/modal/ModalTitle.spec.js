import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import { ref } from 'vue';
import ModalTitle from './ModalTitle.vue';
import { MODAL_ACTIVE } from '@app/state';

describe('ModalTitle', () => {
  const generate = () => {
    const reference = ref(true);

    const rendered = render(ModalTitle, {
      props: { name: 'myModal' },

      global: {
        provide: { [MODAL_ACTIVE]: reference },
        stubs: {
          PanelBar: {
            props: ['name'],
            template: '<p><span>{{ name }}</span><div><slot></slot></div></p>',
          },
          IconButton: {
            template: '<button>btn</button>',
          },
        },
        mocks: {
          $t: (foo) => foo,
        },
      },
    });

    return { reference, rendered };
  };

  test('should base itself off PanelBar with provided name', async () => {
    const {
      rendered: { findByText },
    } = generate();

    expect(await findByText('myModal')).toBeTruthy();
  });

  test("should have a button that closes the modal it's contained in", async () => {
    const {
      rendered: { findByRole },
      reference,
    } = generate();

    const closeButton = await findByRole('button');
    await fireEvent.click(closeButton);
    expect(reference.value).toBeFalsy();
  });
});
