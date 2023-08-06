import { describe, expect, test, vi } from 'vitest';
import { ref } from 'vue';
import { render } from '@testing-library/vue';
import TinyWatermark from './TinyWatermark.vue';
import { useFullStateSize } from './helper/size';

vi.mock('./helper/size');

describe('TinyWatermark', () => {
  const generate = (props) => render(TinyWatermark, { props });

  test('should source its contents from provided path', () => {
    useFullStateSize.mockReturnValue(ref({ width: 10, height: 10 }));

    const { container } = generate({ path: 'path/to/svg' });
    const svg = container.querySelector('image');

    expect(svg.getAttribute('href')).toEqual('path/to/svg');
  });

  test('should be proportional part of smaller dimension (width)', () => {
    useFullStateSize.mockReturnValue(ref({ width: 200, height: 100 }));

    const { container } = generate({ path: 'path/to/svg', proportion: 0.1 });
    const svg = container.querySelector('image');

    expect(svg.getAttribute('width')).toEqual('10');
    expect(svg.getAttribute('height')).toEqual('10');
    expect(svg.getAttribute('x')).toEqual('190');
    expect(svg.getAttribute('y')).toEqual('90');
  });

  test('should be proportional part of smaller dimension (height)', () => {
    useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));

    const { container } = generate({ path: 'path/to/svg', proportion: 0.2 });
    const svg = container.querySelector('image');

    expect(svg.getAttribute('width')).toEqual('40');
    expect(svg.getAttribute('height')).toEqual('40');
    expect(svg.getAttribute('x')).toEqual('160');
    expect(svg.getAttribute('y')).toEqual('260');
  });

  test('should be proportional part of smaller dimension (square)', () => {
    useFullStateSize.mockReturnValue(ref({ width: 350, height: 350 }));

    const { container } = generate({ path: 'path/to/svg', proportion: 0.3 });
    const svg = container.querySelector('image');

    expect(svg.getAttribute('width')).toEqual('105');
    expect(svg.getAttribute('height')).toEqual('105');
    expect(svg.getAttribute('x')).toEqual('245');
    expect(svg.getAttribute('y')).toEqual('245');
  });

  test('should limit proportion to 1', () => {
    useFullStateSize.mockReturnValue(ref({ width: 200, height: 350 }));

    const { container } = generate({ path: 'path/to/svg', proportion: 4 });
    const svg = container.querySelector('image');

    expect(svg.getAttribute('width')).toEqual('200');
    expect(svg.getAttribute('height')).toEqual('200');
    expect(svg.getAttribute('x')).toEqual('0');
    expect(svg.getAttribute('y')).toEqual('150');
  });

  test('should default to 0.25 if no valid proportion is set', () => {
    useFullStateSize.mockReturnValue(ref({ width: 500, height: 400 }));

    const { container } = generate({ path: 'path/to/svg', proportion: 'qwe' });
    const svg = container.querySelector('image');

    expect(svg.getAttribute('width')).toEqual('100'); // 400 * 25% = 100
    expect(svg.getAttribute('height')).toEqual('100');
    expect(svg.getAttribute('x')).toEqual('400');
    expect(svg.getAttribute('y')).toEqual('300');
  });
});
