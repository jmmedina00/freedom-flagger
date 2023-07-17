import { render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import SizingButton from './SizingButton.vue';
import { ref } from 'vue';
import { useSomeConfig } from '../plugin';
import { useCalculatedSizes } from '../../../shared/sizing';

vi.mock('../plugin');
vi.mock('../../../shared/sizing');

describe('SizingButton', () => {
  const generate = () =>
    render(SizingButton, {
      global: {
        mocks: { $t: (foo) => foo },
        stubs: {
          ModalCoupler: {
            template: '<nav><slot></slot></nav>',
          },
          SizingAdjustModal: {
            template: '<span>Modal</span>',
          },
          OptionButton: {
            props: ['secondary', 'icon'],
            template:
              '<button>' +
              '<span class="icon">{{ icon }}</span>' +
              '<span class="primary"><slot name="primary"></slot></span>' +
              '<span class="secondary">{{ secondary }}</span></button>',
          },
        },
      },
    });

  const getCleanHtml = (html = '') =>
    html
      .replaceAll(/data[^ ]+=""/g, '')
      .replaceAll(/\s+/g, ' ')
      .trim();

  const getSpan = (content, classes = []) =>
    `<span class="${classes.join(' ')}">${content}</span>`;

  test('should display size in primary display with no styles when it is fully defined', () => {
    const size = ref({ width: 200, height: 300, aspectRatio: null });
    const dimensions = ref({ width: 200, height: 300 });

    useSomeConfig.mockReturnValue(size);
    useCalculatedSizes.mockReturnValue(dimensions);

    const { container } = generate();
    const span = container.querySelector('.primary');

    const expected = [
      getSpan(200),
      getSpan('x', ['separator']),
      getSpan(300),
    ].join('');

    expect(getCleanHtml(span.innerHTML)).toEqual(expected);
  });

  test('should highlight width in primary display when it is calculated', () => {
    const size = ref({ height: 300, aspectRatio: { x: 2, y: 3 } });
    const dimensions = ref({ width: 200, height: 300 });

    useSomeConfig.mockReturnValue(size);
    useCalculatedSizes.mockReturnValue(dimensions);

    const { container } = generate();
    const span = container.querySelector('.primary');

    const expected = [
      getSpan(200, ['inferred']),
      getSpan('x', ['separator']),
      getSpan(300),
    ].join('');

    expect(getCleanHtml(span.innerHTML)).toEqual(expected);
  });

  test('should highlight height in primary display when it is calculated', () => {
    const size = ref({ width: 200, aspectRatio: { x: 2, y: 3 } });
    const dimensions = ref({ width: 200, height: 300 });

    useSomeConfig.mockReturnValue(size);
    useCalculatedSizes.mockReturnValue(dimensions);

    const { container } = generate();
    const span = container.querySelector('.primary');

    const expected = [
      getSpan(200),
      getSpan('x', ['separator']),
      getSpan(300, ['inferred']),
    ].join('');
    expect(getCleanHtml(span.innerHTML)).toEqual(expected);
  });

  test('should display aspect ratio in secondary display', () => {
    const size = ref({ width: 200, aspectRatio: { x: 2, y: 3 } });
    const dimensions = ref({ width: 200, height: 300 });

    useSomeConfig.mockReturnValue(size);
    useCalculatedSizes.mockReturnValue(dimensions);

    const { container } = generate();
    const span = container.querySelector('.secondary');

    expect(span.innerHTML).toEqual('2:3');
  });

  test('should show "custom" in secondary display when no aspect ratio is defined', () => {
    const size = ref({ width: 200, height: 300, aspectRatio: null });
    const dimensions = ref({ width: 200, height: 300 });

    useSomeConfig.mockReturnValue(size);
    useCalculatedSizes.mockReturnValue(dimensions);

    const { container } = generate();
    const span = container.querySelector('.secondary');

    expect(span.innerHTML).toEqual('custom');
  });

  test('should use landscape icon according to aspect ratio', () => {
    const size = ref({ width: 300, aspectRatio: { x: 3, y: 2 } });
    const dimensions = ref({ width: 300, height: 200 });

    useSomeConfig.mockReturnValue(size);
    useCalculatedSizes.mockReturnValue(dimensions);

    const { container } = generate();
    const span = container.querySelector('.icon');

    expect(span.innerHTML).toEqual('crop_landscape');
  });

  test('should use portrait icon according to aspect ratio', () => {
    const size = ref({ width: 200, aspectRatio: { x: 2, y: 3 } });
    const dimensions = ref({ width: 200, height: 300 });

    useSomeConfig.mockReturnValue(size);
    useCalculatedSizes.mockReturnValue(dimensions);

    const { container } = generate();
    const span = container.querySelector('.icon');

    expect(span.innerHTML).toEqual('crop_portrait');
  });

  test('should use landscape icon when aspect ratio is not defined', () => {
    const size = ref({ width: 200, height: 300, aspectRatio: null });
    const dimensions = ref({ width: 200, height: 300 });

    useSomeConfig.mockReturnValue(size);
    useCalculatedSizes.mockReturnValue(dimensions);

    const { container } = generate();
    const span = container.querySelector('.icon');

    expect(span.innerHTML).toEqual('crop_landscape');
  });

  test('should use landscape icon when aspect ratio is square', () => {
    const size = ref({ width: 200, aspectRatio: { x: 2, y: 2 } });
    const dimensions = ref({ width: 200, height: 200 });

    useSomeConfig.mockReturnValue(size);
    useCalculatedSizes.mockReturnValue(dimensions);

    const { container } = generate();
    const span = container.querySelector('.icon');

    expect(span.innerHTML).toEqual('crop_landscape');
  });
});
