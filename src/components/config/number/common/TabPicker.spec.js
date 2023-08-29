import { fireEvent, render } from '@testing-library/vue';
import { expect, test } from 'vitest';
import TabPicker from './TabPicker.vue';
import { useUpdatableModel } from '@app/util/testing';

describe('TabPicker', () => {
  const generate = (props) =>
    render(TabPicker, { props, global: { mocks: { $t: (foo) => foo } } });

  test('should render as many items as there are values provided', () => {
    const { props } = useUpdatableModel('test');

    const { container } = generate({
      ...props,
      values: [
        // As object param, Vue won't respect the original order it was punched in
        ['test', 'action.test'],
        ['foo', 'foo.bar'],
        ['bar', 'bar.baz'],
        ['nothing', 'do.nothing'],
        ['greet', 'hello.person'],
      ],
    });

    const items = [...container.querySelectorAll('li')];
    const texts = items.map((item) => item.innerText);

    expect(texts).toEqual([
      'action.test',
      'foo.bar',
      'bar.baz',
      'do.nothing',
      'hello.person',
    ]);
  });

  test('should reflect model current state on startup', () => {
    const { props } = useUpdatableModel('bar');

    const { container } = generate({
      ...props,
      values: [
        ['test', 'action.test'],
        ['foo', 'foo.bar'],
        ['bar', 'bar.baz'],
        ['nothing', 'do.nothing'],
        ['greet', 'hello.person'],
      ],
    });

    const activeItem = container.querySelector('li.is-active');
    expect(activeItem.innerText).toEqual('bar.baz');
  });

  test('should update model by clicking a tab that is not active', async () => {
    const { props, reference } = useUpdatableModel('test');

    const { findByText } = generate({
      ...props,
      values: [
        ['test', 'action.test'],
        ['foo', 'foo.bar'],
        ['bar', 'bar.baz'],
        ['nothing', 'do.nothing'],
        ['greet', 'hello.person'],
      ],
    });

    const item = await findByText('hello.person');
    await fireEvent.click(item);

    expect(reference.value).toEqual('greet');
  });

  test("should update model to first value provided if it doesn't match any other value", () => {
    const { props, reference } = useUpdatableModel('wut');

    const { container } = generate({
      ...props,
      values: [
        ['test', 'action.test'],
        ['foo', 'foo.bar'],
        ['bar', 'bar.baz'],
        ['nothing', 'do.nothing'],
        ['greet', 'hello.person'],
      ],
    });

    expect(reference.value).toEqual('test');
  });

  test('should be able to be checked by pressing the Space key', async () => {
    const { props, reference } = useUpdatableModel('test');

    const { findByText } = generate({
      ...props,
      values: [
        ['test', 'action.test'],
        ['foo', 'foo.bar'],
        ['bar', 'bar.baz'],
        ['nothing', 'do.nothing'],
        ['greet', 'hello.person'],
      ],
    });

    const item = await findByText('hello.person');
    await fireEvent.keyDown(item, { code: 'Space' });

    expect(reference.value).toEqual('greet');
  });

  test('should be able to checked by pressing the Enter key', async () => {
    const { props, reference } = useUpdatableModel('test');

    const { findByText } = generate({
      ...props,
      values: [
        ['test', 'action.test'],
        ['foo', 'foo.bar'],
        ['bar', 'bar.baz'],
        ['nothing', 'do.nothing'],
        ['greet', 'hello.person'],
      ],
    });

    const item = await findByText('hello.person');
    await fireEvent.keyDown(item, { code: 'Enter' });

    expect(reference.value).toEqual('greet');
  });
});
