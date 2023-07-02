import { describe, expect } from 'vitest';
import { createApp, ref } from 'vue';
import { getSomeConfig } from './plugin';
import { CONFIG } from '@app/state';

describe('Config plugin', () => {
  test('should be able to retrieve part of config and set only that part to something new', () => {
    let reference;
    const config = ref({ foo: 'bar', bar: 'baz' });

    const app = createApp({
      setup: () => {
        reference = getSomeConfig('foo');
        return () => {};
      },
    });

    app.provide(CONFIG, config);
    app.mount(document.createElement('div'));

    expect(reference.value).toEqual('bar');

    reference.value = 'doremi';
    expect(config.value).toEqual({ foo: 'doremi', bar: 'baz' });
    expect(reference.value).toEqual('doremi');

    app.unmount();
  });

  test('should set default value on state when no value is present', () => {
    const config = ref({ foo: 12 });

    const app = createApp({
      setup: () => {
        const _ = getSomeConfig('bar', 34);
        return () => {};
      },
    });

    app.provide(CONFIG, config);
    app.mount(document.createElement('div'));

    expect(config.value).toEqual({ foo: 12, bar: 34 });
    app.unmount();
  });

  test('should get current value even when default is provided', () => {
    const config = ref({ foo: 'bar', bar: 'baz' });

    const app = createApp({
      setup: () => {
        const _ = getSomeConfig('foo', 'doremi');
        return () => {};
      },
    });

    app.provide(CONFIG, config);
    app.mount(document.createElement('div'));
    expect(config.value).toEqual({ foo: 'bar', bar: 'baz' });
  });
});
