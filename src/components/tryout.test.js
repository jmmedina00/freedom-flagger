import { describe, test } from 'vitest';
import HelloWorld from './HelloWorld.vue';
import { render } from '@testing-library/vue';

describe('Kickstart tests', () => {
  test('should provide message to component', () => {
    const { getByText } = render(HelloWorld, {
      props: { msg: 'Testing' },
    });

    getByText('Testing');
  });
});
