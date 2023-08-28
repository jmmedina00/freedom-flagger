import {
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import { useLinkToCurrentNumber } from './link';
import { ref } from 'vue';
import { NOTIFICATION, NUMBER_BYTES } from '@app/state';
import { fireEvent, render } from '@testing-library/vue';
import NumberSection from './NumberSection.vue';

vi.mock('./link');

describe('NumberSection', () => {
  const writeText = vi.fn();

  const clipboard = { writeText };
  const navigator = { clipboard };

  const generate = (provide) =>
    render(NumberSection, {
      global: {
        provide,
        stubs: {
          PanelBar: {
            props: ['name'],
            template: '<p><span>{{ name }}</span><div><slot></slot></div></p>',
          },
          ModalCoupler: {
            template: '<nav><slot></slot></nav>',
          },
          IconButton: {
            props: ['icon'],
            template: '<button>{{ icon }}</button>',
          },
          NumberSummary: {
            template: '<p>write</p>',
          },
          NumberCarousel: {
            template: '<p>read</p>',
          },
        },
        mocks: {
          $t: (foo) => foo,
        },
      },
    });

  beforeAll(() => {
    vi.stubGlobal('navigator', navigator);
    vi.stubGlobal('console', {
      log: console.log,
      error: vi.fn(),
      warn: vi.fn(),
    });
  });

  beforeEach(() => {
    useLinkToCurrentNumber.mockReturnValue(ref('foo.bar'));
  });

  afterEach(() => {
    useLinkToCurrentNumber.mockReset();
    writeText.mockReset();
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  test("should allow to copy current flag's link and notify the user", async () => {
    writeText.mockResolvedValue({});

    const notification = ref(null);
    const provide = {
      [NUMBER_BYTES]: ref([0]),
      [NOTIFICATION]: notification,
    };

    const { findByText } = generate(provide);
    const button = await findByText('link');

    await fireEvent.click(button);
    await Promise.resolve();

    expect(notification.value).toEqual({
      message: 'actions.link.success',
      color: 'success',
    });
    expect(writeText).toHaveBeenCalledWith('foo.bar');
  });

  test('should notify the user when flag link copy goes wrong', async () => {
    writeText.mockRejectedValue({});

    const notification = ref(null);
    const provide = {
      [NUMBER_BYTES]: ref([0]),
      [NOTIFICATION]: notification,
    };

    const { findByText } = generate(provide);
    const button = await findByText('link');

    await fireEvent.click(button);
    await Promise.resolve();

    expect(notification.value).toEqual({
      message: 'actions.link.error',
      color: 'danger',
    });
    expect(writeText).toHaveBeenCalledWith('foo.bar');
  });

  test('should allow to alternate between view-only and edit screens for number', async () => {
    const provide = {
      [NUMBER_BYTES]: ref([0]),
      [NOTIFICATION]: ref(null),
    };

    const { findByText, queryByText } = generate(provide);
    const button = await findByText('keyboard_double_arrow_up');

    await fireEvent.click(button);
    expect(queryByText('write')).toBeTruthy();
    expect(queryByText('read')).toBeFalsy();

    await fireEvent.click(button);
    expect(queryByText('write')).toBeFalsy();
    expect(queryByText('read')).toBeTruthy();
  });
});
