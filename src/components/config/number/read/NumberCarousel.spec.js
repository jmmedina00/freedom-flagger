import { fireEvent, render } from '@testing-library/vue';
import { describe, expect, test } from 'vitest';
import NumberCarousel from './NumberCarousel.vue';

describe('NumberCarousel', () => {
  test('should be able to alternate between hex, decimal and binary display', async () => {
    const { findByLabelText, findByText } = render(NumberCarousel, {
      global: {
        mocks: { $t: (foo) => foo },
        stubs: {
          NumberDisplay: {
            props: ['base'],
            template: '<span>Base {{ base }}</span>',
          },
        },
      },
    });

    const hex = await findByLabelText('bytes.hex');
    const dec = await findByLabelText('bytes.dec');
    const bin = await findByLabelText('bytes.bin');
    expect(hex.checked).toBeTruthy();
    expect(dec.checked).toBeFalsy();
    expect(bin.checked).toBeFalsy();

    expect(await findByText('Base 16')).toBeTruthy();

    await fireEvent.click(dec);
    expect(hex.checked).toBeFalsy();
    expect(bin.checked).toBeFalsy();
    expect(await findByText('Base 10')).toBeTruthy();

    await fireEvent.click(bin);
    expect(hex.checked).toBeFalsy();
    expect(dec.checked).toBeFalsy();
    expect(await findByText('Base 2')).toBeTruthy();
  });
});
