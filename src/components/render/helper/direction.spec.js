import { describe, expect, test } from 'vitest';
import { useDirectionHolds } from './direction';
import { ref } from 'vue';

describe('Direction handling composable', () => {
  test('should provide x axis and width for vertical direction', () => {
    const { positionHold, sizeHold, stretchHold } = useDirectionHolds(
      ref('vertical')
    );
    expect(positionHold.value).toEqual('x');
    expect(sizeHold.value).toEqual('width');
    expect(stretchHold.value).toEqual('height');
  });

  test('should provide y axis and height for horizontal direction', () => {
    const { positionHold, sizeHold, stretchHold } = useDirectionHolds(
      ref('horizontal')
    );
    expect(positionHold.value).toEqual('y');
    expect(sizeHold.value).toEqual('height');
    expect(stretchHold.value).toEqual('width');
  });

  test("should be able to recognize direction, even if it's not fully lowercase", () => {
    const directionParam = ref('Vertical');
    const { positionHold } = useDirectionHolds(directionParam);

    expect(positionHold.value).toEqual('x');

    directionParam.value = 'hOrIZoNtAl';
    expect(positionHold.value).toEqual('y');

    directionParam.value = 'VERTICAL';
    expect(positionHold.value).toEqual('x');
  });

  test('should default to vertical direction if provided direction is not valid', () => {
    const { positionHold } = useDirectionHolds(ref('DUNNO'));
    expect(positionHold.value).toEqual('x');
  });

  test('should default to vertical direction if no direction is provided', () => {
    const { positionHold } = useDirectionHolds(ref(undefined));
    expect(positionHold.value).toEqual('x');
  });
});
