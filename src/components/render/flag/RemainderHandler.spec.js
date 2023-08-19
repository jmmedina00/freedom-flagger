import { beforeEach, describe, expect, test, vi } from 'vitest';
import { useFullStateSize } from '../helper/size';
import { computed, inject, ref } from 'vue';
import {
  REMAINDER_COMPONENTS,
  REM_MOSAIC,
} from '@app/components/shared/constant/remainder';
import { render } from '@testing-library/vue';
import { CONFIG_REMAINDER, DECORATE_CONFIG, DECORATE_SIZE } from '@app/state';
import { placeColorsOnIndexes } from '@app/components/shared/color-index';
import { useSomeConfig } from '@app/components/config/options/plugin';
import RemainderHandler from './RemainderHandler.vue';

vi.mock('../helper/size');
vi.mock('@app/components/shared/color-index');
vi.mock('@app/components/config/options/plugin');

describe('RemainderHandler', () => {
  const getTemplate = (
    component = 'foo'
  ) => `<p>Size: {{ size.width }} x {{ size.height }}</p>
  <p>Component: ${component}</p>
  <p>Config: {{ config }}</p>`;

  const commonSetup = () => {
    const config = inject(DECORATE_CONFIG);
    const size = inject(DECORATE_SIZE);

    const readableConfig = computed(() => JSON.stringify(config?.value));

    return { config: readableConfig, size };
  };

  const titles = {
    border: 'Border',
    triangle: 'Triangle',
    mosaic: 'Mosaic',
  };

  const generate = (props) =>
    render(RemainderHandler, {
      props,
      global: {
        stubs: {
          BorderDecorate: {
            setup: commonSetup,
            template: getTemplate(titles.border),
          },
          CornerTriangleDecorate: {
            setup: commonSetup,
            template: getTemplate(titles.triangle),
          },
          MosaicDecorate: {
            setup: commonSetup,
            template: getTemplate(titles.mosaic),
          },
        },
      },
    });

  const possibleDecorates = Object.keys(REMAINDER_COMPONENTS);

  beforeEach(() => {
    useFullStateSize.mockReturnValue(ref({ width: 400, height: 200 }));
    placeColorsOnIndexes.mockReset();
  });

  test('should provide state sizing directly as decorate size', async () => {
    const config = {
      component: REM_MOSAIC,
      config: { asd: 123, qwe: 234, re: 'la' },
      colorChoices: 3,
      adapted: ['qwe', 're'],
    };
    useSomeConfig.mockReturnValue(ref(config));

    const { findByText, container } = generate({ bytes: [0, 255] });

    const sizeParagraph = await findByText('Size:', { exact: false });
    expect(sizeParagraph.innerText).toEqual('Size: 400 x 200');
  });

  test.each(possibleDecorates)(
    'should render %s component as specified by remainder config',
    async (component) => {
      const config = { component, config: { foo: 'bar', adapted: [] } };
      useSomeConfig.mockReturnValue(ref(config));
      const { findByText, container } = generate({ bytes: [0, 255] });

      const componentParagraph = await findByText('Component', {
        exact: false,
      });
      expect(componentParagraph.innerText).toEqual(
        'Component: ' + titles[component]
      );
    }
  );

  test('should provide adapted "config" from remainder config with grey colors (colorChoices = 2) and 2 bytes', async () => {
    placeColorsOnIndexes.mockReturnValue({ adapted: true, test: 12 });

    const config = {
      component: REM_MOSAIC,
      config: { asd: 123, qwe: 234 },
      colorChoices: 2,
      adapted: ['asd', 'qwe'],
    };
    useSomeConfig.mockReturnValue(ref(config));

    const { findByText } = generate({ bytes: [31, 139] });

    const configParagraph = await findByText('Config:', { exact: false });
    expect(configParagraph.innerText).toEqual(
      'Config: ' + JSON.stringify({ adapted: true, test: 12 })
    );

    expect(placeColorsOnIndexes).toHaveBeenCalledWith(
      { ...config.config },
      { fields: ['asd', 'qwe'], colors: ['#1f1f1f', '#8b8b8b'] }
    );
    expect(useSomeConfig).toHaveBeenCalledWith(CONFIG_REMAINDER);
  });

  test('should provide adapted "config" from remainder config with grey colors (colorChoices = 2) and 1 byte', async () => {
    placeColorsOnIndexes.mockReturnValue({ adapted: true, test: 55 });

    const config = {
      component: REM_MOSAIC,
      config: { asd: 123, qwe: 234 },
      colorChoices: 2,
      adapted: ['asd'],
    };
    useSomeConfig.mockReturnValue(ref(config));

    const { findByText } = generate({ bytes: [32] });

    const configParagraph = await findByText('Config:', { exact: false });
    expect(configParagraph.innerText).toEqual(
      'Config: ' + JSON.stringify({ adapted: true, test: 55 })
    );

    expect(placeColorsOnIndexes).toHaveBeenCalledWith(
      { ...config.config },
      { fields: ['asd'], colors: ['#202020', '#202020'] }
    );
  });

  test('should provide adapted "config" from remainder config with sample colors (colorChoices = 3) and 2 bytes', async () => {
    placeColorsOnIndexes.mockReturnValue({ adapted: true, test: 23 });

    const config = {
      component: REM_MOSAIC,
      config: { asd: 123, qwe: 234, re: 'la' },
      colorChoices: 3,
      adapted: ['qwe', 're'],
    };
    useSomeConfig.mockReturnValue(ref(config));

    const { findByText } = generate({ bytes: [55, 166] });

    const configParagraph = await findByText('Config:', { exact: false });
    expect(configParagraph.innerText).toEqual(
      'Config: ' + JSON.stringify({ adapted: true, test: 23 })
    );

    expect(placeColorsOnIndexes).toHaveBeenCalledWith(
      { ...config.config },
      { fields: ['qwe', 're'], colors: ['#37a600', '#3700a6', '#0037a6'] }
    );
  });

  test('should provide adapted "config" from remainder config with sample colors (colorChoices = 3) and 1 byte', async () => {
    placeColorsOnIndexes.mockReturnValue({ adapted: true, test: 88 });

    const config = {
      component: REM_MOSAIC,
      config: { asd: 123, qwe: 234, re: 'la' },
      colorChoices: 3,
      adapted: ['re'],
    };
    useSomeConfig.mockReturnValue(ref(config));

    const { findByText } = generate({ bytes: [240] });

    const configParagraph = await findByText('Config:', { exact: false });
    expect(configParagraph.innerText).toEqual(
      'Config: ' + JSON.stringify({ adapted: true, test: 88 })
    );

    expect(placeColorsOnIndexes).toHaveBeenCalledWith(
      { ...config.config },
      { fields: ['re'], colors: ['#f00000', '#00f000', '#0000f0'] }
    );
  });
});
