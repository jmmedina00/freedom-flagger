import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import { ref } from 'vue';
import { MODAL_ACTIVE, NUMBER_BYTES } from '@app/state';
import NumberFromTextModal from './NumberFromTextModal.vue';

describe('NumberFromTextModal', () => {
  const generate = () => {
    const reference = ref([1, 2, 3]);
    const isActive = ref(true);

    const rendered = render(NumberFromTextModal, {
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

  test('should display empty textarea and preview paragraph at start', async () => {
    const {
      rendered: { findByRole, container },
    } = generate();

    const preview = container.querySelector('.preview');
    expect(preview.innerText).toEqual('');

    const textarea = await findByRole('textbox');
    expect(textarea.value).toEqual('');
  });

  test("should update preview to bytes representation of textarea's value", async () => {
    const {
      rendered: { findByRole, container },
    } = generate();

    const textarea = await findByRole('textbox');
    await fireEvent.update(textarea, 'This is a test');

    const preview = container.querySelector('.preview');
    expect(preview.innerText).toEqual(
      '84,104,105,115,32,105,115,32,97,32,116,101,115,116'
    ); // Equivalent to "This is a test"
  });

  test('should split multi-byte characters into single bytes along with the others', async () => {
    const {
      rendered: { findByRole, container },
      isActive,
      reference,
    } = generate();

    const textarea = await findByRole('textbox');
    await fireEvent.update(textarea, 'ぽęд⇋コяڞج了ŋ⁈人ณ걨ヴ꽉で');

    const preview = container.querySelector('.preview');
    expect(preview.innerText).toEqual(
      '48,125,' + // ぽ = 307d
        '1,25,' + // ę = 0119
        '4,52,' + // д = 0434
        '33,203,' + // ⇋ = 21cb
        '48,179,' + // コ = 30b3
        '4,79,' + // я = 044f
        '6,158,' + // <sad> = 069e
        '6,44,' + // <jeem> = 062c
        '78,134,' + // 了 = 4e86
        '1,75,' + // ŋ = 014b
        '32,72,' + // ⁈ = 2048
        '78,186,' + // 人 = 4eba
        '14,19,' + // ณ = 0e13
        '172,104,' + // 걨 = ac68
        '48,244,' + // ヴ = 30f4
        '175,73,' + // 꽉 = af49
        '48,103' // で = 3067
    );

    expect(isActive.value).toBeTruthy();
    expect(reference.value).toEqual([1, 2, 3]); // Assert default values haven't changed
  });

  test("should update state's number to textarea's bytes and close modal when clickling the apply button", async () => {
    const {
      rendered: { findByRole, container },
      isActive,
      reference,
    } = generate();

    const textarea = await findByRole('textbox');
    await fireEvent.update(textarea, '人 = pȩrsȯn');

    const applyButton = await findByRole('button');
    await fireEvent.click(applyButton);

    expect(isActive.value).toBeFalsy();
    expect(reference.value).toEqual([
      78,
      186, // 人
      32,
      61,
      32,
      112,
      2,
      41, // ȩ
      114,
      115,
      2,
      47, // ȯ
      110,
    ]);
  });
});
