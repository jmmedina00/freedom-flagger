import { expect } from 'vitest';
import { provideDefault } from './provide';

describe('Provide plugin generator', () => {
  test('should provide an app with ref containing value in specified key', () => {
    const provide = vi.fn();
    const app = { provide };

    const plugin = provideDefault('foo', 'bar');
    plugin.install(app);

    const [key, reference] = provide.mock.calls[0];
    expect(key).toEqual('foo');
    expect(reference.value).toEqual('bar');

    reference.value = 'baz';
    expect(reference.value).toEqual('baz');
  });
});
