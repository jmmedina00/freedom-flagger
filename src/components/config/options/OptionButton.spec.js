import { render } from '@testing-library/vue';
import { describe, expect } from 'vitest';
import OptionButton from './OptionButton.vue';
import IconStub from '../../shared/stubs/IconStub.vue';

describe('OptionButton', () => {
  const generate = (props, slots = {}) =>
    render(OptionButton, {
      props,
      global: { stubs: { DiscreteIcon: IconStub } },
      slots,
    });

  test('should display icon in corresponding controller along with primary and secondary text', () => {
    const props = {
      icon: 'face',
      primary: 'Lorem ipsum',
      secondary: 'dolor sit amet',
    };

    const { container, emitted } = generate(props);

    const icon = container.querySelector('.button p');
    expect(icon.innerHTML).toEqual('Icon: face');

    const primary = container.querySelector('.button .primary');
    expect(primary.innerHTML).toEqual('Lorem ipsum');

    const secondary = container.querySelector('.button .secondary');
    expect(secondary.innerHTML).toEqual('dolor sit amet');

    expect(emitted()['click']).toBeFalsy();
  });

  test('should pass button click event through', () => {
    const props = {
      icon: 'face',
      primary: 'Lorem ipsum',
      secondary: 'dolor sit amet',
    };

    const { getByRole, emitted } = generate(props);

    const button = getByRole('button');
    button.click();

    expect(emitted()['click']).toBeTruthy();
  });

  test('should omit primary text span if no primary text provided', () => {
    const props = {
      icon: 'face',
      secondary: 'dolor sit amet',
    };

    const { container } = generate(props);
    const primary = container.querySelector('.button .primary');
    expect(primary).toBeNull();
  });

  test('should omit secondary text span if no secondary text provided', () => {
    const props = {
      icon: 'face',
      primary: 'Lorem ipsum',
    };

    const { container } = generate(props);
    const secondary = container.querySelector('.button .secondary');
    expect(secondary).toBeNull();
  });

  test('should favour slot over prop for both primary and secondary text - and add proper class to it', () => {
    const props = {
      icon: 'face',
      primary: 'Do not',
      /* secondary: 'show this', */
    };

    const primary = '<p>Primary slot</p>';
    const secondary = '<code>Secondary slot</code>';

    const { container } = generate(props, { primary, secondary });

    const primaryElement = container.querySelector('.button .primary p');
    expect(primaryElement.innerHTML).toEqual('Primary slot');

    const secondaryElement = container.querySelector('.button .secondary code');
    expect(secondaryElement.innerHTML).toEqual('Secondary slot');
  });
});
