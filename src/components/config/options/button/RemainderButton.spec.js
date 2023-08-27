import { REMAINDER_ICONS } from '@app/components/shared/constant/remainder';
import { render } from '@testing-library/vue';
import { describe, expect, test, vi } from 'vitest';
import { useSomeConfig } from '../plugin';
import { ref } from 'vue';
import RemainderButton from './RemainderButton.vue';
import { CONFIG_REMAINDER } from '@app/state';

vi.mock('../plugin');

describe('RemainderButton', () => {
  const testData = Object.entries(Object.keys(REMAINDER_ICONS));

  test.each(testData)(
    '%i: should render %s icon, name and whether complex colors are enabled',
    (index, component) => {
      const config = {
        component,
        config: { asd: 123, qwe: 234 },
        colorChoices: 2 + (index % 2 === 0),
        adapted: ['asd', 'qwe'],
      };
      useSomeConfig.mockReturnValue(ref(config));

      const { container } = render(RemainderButton, {
        global: {
          mocks: { $t: (foo) => foo },
          stubs: {
            ModalCoupler: {
              template: '<nav><slot></slot></nav>',
            },
            RemainingBytesModal: {
              template: '<span>Modal</span>',
            },
            OptionButton: {
              props: ['primary', 'secondary', 'icon'],
              template:
                '<button>' +
                '<span class="icon">{{ icon }}</span>' +
                '<span class="primary">{{ primary }}</span>' +
                '<span class="secondary">{{ secondary }}</span></button>',
            },
          },
        },
      });

      const icon = container.querySelector('.icon');
      expect(icon.innerText).toEqual(REMAINDER_ICONS[component]);

      const primary = container.querySelector('.primary');
      expect(primary.innerText).toEqual('decorate.' + component);

      const secondary = container.querySelector('.secondary');
      const expectedSecondary = 'options.color.mode.' + (index % 2 === 0);
      expect(secondary.innerText).toEqual(expectedSecondary);

      expect(useSomeConfig).toHaveBeenCalledWith(CONFIG_REMAINDER);
    }
  );
});
