import { describe, expect, test } from 'vitest';
import { createApp, ref } from 'vue';
import { useDefaultedConfig } from './default';
import { HANDLING_CONFIG } from '@app/state';

describe('Default decorate config composable', () => {
  const getReference = (
    provided,
    params = ['TEST', { items: 10, size: 2 }],
    comp = useDefaultedConfig
  ) => {
    let reference;
    const app = createApp({
      setup: () => {
        reference = comp(...params);
        return () => {};
      },
    });

    app.provide(HANDLING_CONFIG, provided);
    app.mount(document.createElement('div'));

    return { reference, disable: () => app.unmount() };
  };

  test('should provide reference equivalent to "config" in handling, assuming component matches', () => {
    const handlingConfig = ref({
      foo: 'bar',
      component: 'TEST',
      config: {
        items: 3,
        size: 27,
      },
    });

    const { reference: actual, disable } = getReference(handlingConfig);

    expect(actual.value).toEqual({
      items: 3,
      size: 27,
    });
    expect(handlingConfig.value).toEqual({
      foo: 'bar',
      component: 'TEST',
      config: {
        items: 3,
        size: 27,
      },
    });
    disable(); // Can't escape disabling at the very end
  });

  test('should allow to change config by altering the returned value', () => {
    const handlingConfig = ref({
      foo: 'bar',
      component: 'TEST',
      config: {
        items: 3,
        size: 27,
      },
    });

    const { reference: actual, disable } = getReference(handlingConfig);
    actual.value = { items: 40, size: 60 };

    expect(actual.value).toEqual({
      items: 40,
      size: 60,
    });
    expect(handlingConfig.value).toEqual({
      foo: 'bar',
      component: 'TEST',
      config: {
        items: 40,
        size: 60,
      },
    });

    disable();
  });

  test('should change "config" to provided default if "component" does not match "name"', () => {
    const handlingConfig = ref({
      foo: 'bar',
      component: 'WRONG',
      config: {
        text: 'Dunno',
        fake: false,
        icons: 2,
      },
    });

    const { reference: actual, disable } = getReference(handlingConfig);

    expect(actual.value).toEqual({
      items: 10,
      size: 2,
    });
    expect(handlingConfig.value).toEqual({
      foo: 'bar',
      component: 'TEST',
      config: {
        items: 10,
        size: 2,
      },
    });

    disable();
  });

  test('should set default config if "config" is missing', () => {
    const handlingConfig = ref({
      foo: 'baz',
      component: 'TEST',
    });

    const { reference: actual, disable } = getReference(handlingConfig);

    expect(actual.value).toEqual({
      items: 10,
      size: 2,
    });
    expect(handlingConfig.value).toEqual({
      foo: 'baz',
      component: 'TEST',
      config: {
        items: 10,
        size: 2,
      },
    });

    disable();
  });

  test('should set default config if "config" is completely missing', () => {
    const handlingConfig = ref({
      foo: 'baz',
    });

    const { reference: actual, disable } = getReference(handlingConfig);

    expect(actual.value).toEqual({
      items: 10,
      size: 2,
    });
    expect(handlingConfig.value).toEqual({
      foo: 'baz',
      component: 'TEST',
      config: {
        items: 10,
        size: 2,
      },
    });

    disable();
  });

  test('should allow to set essential information outside component config', () => {
    const handlingConfig = ref({
      foo: 'bar',
      component: 'WRONG',
      config: {
        text: 'Dunno',
        fake: false,
        icons: 2,
      },
    });

    const { reference: actual, disable } = getReference(handlingConfig, [
      'TEST',
      { items: 20, size: 3 },
      { test: 'foo', re: 'la' },
    ]);

    expect(actual.value).toEqual({
      items: 20,
      size: 3,
    });
    expect(handlingConfig.value).toEqual({
      foo: 'bar',
      component: 'TEST',
      config: {
        items: 20,
        size: 3,
      },
      test: 'foo',
      re: 'la',
    });

    disable();
  });

  test('should replace essential information even if initially provided component is correct', () => {
    const handlingConfig = ref({
      foo: 'bar',
      component: 'TEST',
      config: {
        items: 3,
        size: 27,
      },
    });

    const { reference: actual, disable } = getReference(handlingConfig, [
      'TEST',
      { items: 20, size: 3 },
      { foo: 'qwe', active: true },
    ]);

    expect(handlingConfig.value).toEqual({
      foo: 'qwe',
      active: true,
      component: 'TEST',
      config: {
        items: 3,
        size: 27,
      },
    });

    disable();
  });
});
