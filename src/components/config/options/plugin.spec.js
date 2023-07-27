import { describe, expect } from 'vitest';
import { createApp, ref } from 'vue';
import {
  unsetConfig,
  useSomeConfig,
  useWhetherSomeConfigPresent,
} from './plugin';
import { CONFIG } from '@app/state';

describe('Config plugin', () => {
  test('should be able to retrieve part of config and set only that part to something new', () => {
    let reference;
    const config = ref({ foo: 'bar', bar: 'baz' });

    const app = createApp({
      setup: () => {
        reference = useSomeConfig('foo');
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
        const _ = useSomeConfig('bar', 34);
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
        const _ = useSomeConfig('foo', 'doremi');
        return () => {};
      },
    });

    app.provide(CONFIG, config);
    app.mount(document.createElement('div'));
    expect(config.value).toEqual({ foo: 'bar', bar: 'baz' });
    app.unmount();
  });

  test('should not provide value without default when no value is present', () => {
    let reference;
    const config = ref({ foo: 'bar', bar: 'baz' });

    const app = createApp({
      setup: () => {
        reference = useSomeConfig('rip');
        return () => {};
      },
    });

    app.provide(CONFIG, config);
    app.mount(document.createElement('div'));
    expect(reference.value).toBeFalsy();

    app.unmount();
  });

  test('should be able to unset given config key', () => {
    const config = ref({ foo: 'bar', bar: 'baz' });

    const app = createApp({
      setup: () => {
        unsetConfig('foo');
        return () => {};
      },
    });

    app.provide(CONFIG, config);
    app.mount(document.createElement('div'));
    expect(config.value).toEqual({ bar: 'baz' });
    app.unmount();
  });

  test('should provide a flag set to true when given config is defined', () => {
    let reference;
    const config = ref({ foo: 'bar', bar: 'baz' });

    const app = createApp({
      setup: () => {
        reference = useWhetherSomeConfigPresent('foo');
        return () => {};
      },
    });

    app.provide(CONFIG, config);
    app.mount(document.createElement('div'));
    expect(reference.value).toBeTruthy();

    app.unmount();
  });

  test('should provide a flag set to false when given config is undefined', () => {
    let reference;
    const config = ref({ foo: 'bar', bar: 'baz' });

    const app = createApp({
      setup: () => {
        reference = useWhetherSomeConfigPresent('rip');
        return () => {};
      },
    });

    app.provide(CONFIG, config);
    app.mount(document.createElement('div'));
    expect(reference.value).toBeFalsy();

    app.unmount();
  });
});
