import { afterAll, beforeAll, describe, expect, test, vi } from 'vitest';
import { ref } from 'vue';
import { fireEvent, render } from '@testing-library/vue';
import NumberFromFileModal from './NumberFromFileModal.vue';
import { MODAL_ACTIVE, NUMBER_BYTES } from '@app/state';

describe('NumberFromFileModal', () => {
  beforeAll(() => {
    vi.stubGlobal('console', {
      log: console.log,
      error: vi.fn(),
      warn: vi.fn(), // testing-library spits out some annoying warnings
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  const generate = () => {
    const reference = ref([1, 2, 3]);
    const isActive = ref(true);

    const rendered = render(NumberFromFileModal, {
      global: {
        provide: {
          [MODAL_ACTIVE]: isActive,
          [NUMBER_BYTES]: reference,
        },
        stubs: {
          NumberDisplay: {
            props: ['number'],
            template: '<p>{{ number.value.toString() }}</p>',
          },
        },
        mocks: {
          $t: (foo) => foo,
        },
      },
    });

    return { isActive, reference, rendered };
  };

  const getFileEvent = (array) => ({
    target: {
      files: [new File([Uint8Array.from([...array])], 'data.bin')],
    },
  });

  test('should start with empty preview paragraph and greyed-out apply button', async () => {
    const {
      rendered: { container, findByText },
    } = generate();

    const preview = container.querySelector('.preview');
    expect(preview.innerText).toEqual('');

    const applyButton = await findByText('apply');
    expect(applyButton.disabled).toBeTruthy();
  });

  test('should set preview to representation of uploaded file data and make apply button enabled', async () => {
    const {
      rendered: { container, findByText },
      reference,
      isActive,
    } = generate();

    const uploadInput = container.querySelector('.file-input');
    await fireEvent.change(uploadInput, getFileEvent([123, 34, 56, 200])); // Doesn't want me to use "change", but I couldn't find anything better...

    const preview = container.querySelector('.preview');
    expect(preview.innerText).toEqual('123,34,56,200');

    const errorParagraph = container.querySelector('.has-text-danger');
    expect(errorParagraph).toBeNull();

    const applyButton = await findByText('apply');
    expect(applyButton.disabled).toBeFalsy();

    expect(isActive.value).toBeTruthy();
    expect(reference.value).toEqual([1, 2, 3]); // Assert default values haven't changed
  });

  test('should not attempt to process files larger than 1kb', async () => {
    const {
      rendered: { container, findByText },
    } = generate();

    const crazyContents = new Array(0x1000).fill(65); // 4kb - too large to sanely process in this context
    const uploadInput = container.querySelector('.file-input');
    await fireEvent.change(uploadInput, getFileEvent(crazyContents));

    const preview = container.querySelector('.preview');
    expect(preview.innerText).toEqual('');

    const errorParagraph = container.querySelector('.has-text-danger');
    expect(errorParagraph).not.toBeNull();

    const applyButton = await findByText('apply');
    expect(applyButton.disabled).toBeTruthy();
  });

  test('should essentially reset modal state when too large file was uploaded after sane upload', async () => {
    const {
      rendered: { container, findByText },
    } = generate();

    const crazyContents = new Array(0x1000).fill(65); // 4kb - too large to sanely process in this context
    const uploadInput = container.querySelector('.file-input');

    await fireEvent.change(uploadInput, getFileEvent([123, 34, 56, 200]));
    await fireEvent.change(uploadInput, getFileEvent(crazyContents));

    const preview = container.querySelector('.preview');
    expect(preview.innerText).toEqual('');

    const applyButton = await findByText('apply');
    expect(applyButton.disabled).toBeTruthy();
  });

  test("should update state's number to processed bytes and close modal when clickling the apply button", async () => {
    const {
      rendered: { container, findByText },
      isActive,
      reference,
    } = generate();

    const uploadInput = container.querySelector('.file-input');
    await fireEvent.change(uploadInput, getFileEvent([2, 4, 6, 8, 10]));

    const applyButton = await findByText('apply');
    await fireEvent.click(applyButton);

    expect(isActive.value).toBeFalsy();
    expect(reference.value).toEqual([2, 4, 6, 8, 10]);
  });
});
