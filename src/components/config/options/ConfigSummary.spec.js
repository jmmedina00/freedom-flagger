import { useFullStateSize } from '@app/components/render/helper/size';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useExportToClipboard } from './export/clipboard';
import { useDownloadFlag } from './export/download';
import { fireEvent, render } from '@testing-library/vue';
import ConfigSummary from './ConfigSummary.vue';
import { FULL_FLAG_DISPLAY, NOTIFICATION } from '@app/state';
import { useStorage } from '@vueuse/core';

vi.mock('vue-i18n');
vi.mock('@vueuse/core');
vi.mock('./export/clipboard');
vi.mock('./export/download');
vi.mock('@app/components/render/helper/size');

describe('ConfigSummary', () => {
  const locale = ref(null);

  beforeAll(() => {
    vi.stubGlobal('console', {
      log: console.log,
      error: vi.fn(),
      warn: vi.fn(),
    });
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  const generate = (provide) =>
    render(ConfigSummary, {
      global: {
        provide,
        stubs: {
          PanelBar: {
            props: ['name'],
            template: '<p><span>{{ name }}</span><div><slot></slot></div></p>',
          },
          IconButton: {
            props: ['icon'],
            template: '<button>{{ icon }}</button>',
          },
          SizingButton: {
            template: '<p>Sizing</p>',
          },
          RemainderButton: {
            template: '<p>Remainder</p>',
          },
          RenderingOptions: {
            template: '<p>Rendering</p>',
          },
        },
        mocks: {
          $t: (foo) => foo,
        },
      },
    });

  beforeEach(() => {
    locale.value = 'pl';
    useI18n.mockReturnValue({
      t: (foo) => foo,
      availableLocales: ['ru', 'pl', 'de', 'dk', 'no'],
      locale,
    });
    useFullStateSize.mockReturnValue(ref({ width: 200, height: 300 }));
  });

  afterEach(() => {
    useExportToClipboard.mockReset();
    useDownloadFlag.mockReset();
  });

  test('should allow to set the app to full screen', async () => {
    const isFullScreen = ref(false);
    const provide = {
      [NOTIFICATION]: ref(null),
      [FULL_FLAG_DISPLAY]: isFullScreen,
    };

    const { findByText } = generate(provide);
    const button = await findByText('fullscreen');

    await fireEvent.click(button);
    expect(isFullScreen.value).toBeTruthy();
  });

  test('should allow to copy the flag and notify the user', async () => {
    useExportToClipboard.mockResolvedValue({});
    const notification = ref(null);

    const provide = {
      [NOTIFICATION]: notification,
      [FULL_FLAG_DISPLAY]: ref(false),
    };

    const { findByText } = generate(provide);
    const button = await findByText('content_copy');

    await fireEvent.click(button);
    await Promise.resolve();

    expect(notification.value).toEqual({
      message: 'actions.copy.success',
      color: 'success',
    });
    expect(useExportToClipboard).toHaveBeenCalledWith(expect.anything(), {
      width: 200,
      height: 300,
    });
  });

  test('should notify the user when flag copy goes wrong', async () => {
    useExportToClipboard.mockRejectedValue({});
    const notification = ref(null);

    const provide = {
      [NOTIFICATION]: notification,
      [FULL_FLAG_DISPLAY]: ref(false),
    };

    const { findByText } = generate(provide);
    const button = await findByText('content_copy');

    await fireEvent.click(button);
    await Promise.resolve();

    expect(notification.value).toEqual({
      message: 'actions.copy.error',
      color: 'danger',
    });
    expect(useExportToClipboard).toHaveBeenCalledWith(expect.anything(), {
      width: 200,
      height: 300,
    });
  });

  test('should allow to download the flag', async () => {
    useDownloadFlag.mockResolvedValue({});
    const notification = ref(null);

    const provide = {
      [NOTIFICATION]: notification,
      [FULL_FLAG_DISPLAY]: ref(false),
    };

    const { findByText } = generate(provide);
    const button = await findByText('file_download');

    await fireEvent.click(button);
    await Promise.resolve();

    expect(notification.value).toBeFalsy();
    expect(useDownloadFlag).toHaveBeenCalledWith(
      expect.anything(),
      'actions.download.filename',
      {
        width: 200,
        height: 300,
      }
    );
  });

  test('should notify the user when flag download goes wrong', async () => {
    useDownloadFlag.mockRejectedValue({});
    const notification = ref(null);

    const provide = {
      [NOTIFICATION]: notification,
      [FULL_FLAG_DISPLAY]: ref(false),
    };

    const { findByText } = generate(provide);
    const button = await findByText('file_download');

    await fireEvent.click(button);
    await Promise.resolve();

    expect(notification.value).toEqual({
      message: 'actions.download.error',
      color: 'danger',
    });
    expect(useDownloadFlag).toHaveBeenCalledWith(
      expect.anything(),
      'actions.download.filename',
      {
        width: 200,
        height: 300,
      }
    );
  });

  test('should allow to change language infinitely and update everything accordingly', async () => {
    const stored = ref(null);
    const notification = ref(null);

    useStorage.mockReturnValue(stored);

    const provide = {
      [NOTIFICATION]: notification,
      [FULL_FLAG_DISPLAY]: ref(false),
    };

    const { findByText } = generate(provide);
    const button = await findByText('language');

    await fireEvent.click(button);

    expect(notification.value).toEqual({
      message: 'actions.language.current',
      color: 'info',
    });
    expect(locale.value).toEqual('de');
    expect(stored.value).toEqual('de');
    expect(useStorage).toHaveBeenCalledWith('lang');

    const nextExpected = ['dk', 'no', 'ru', 'pl', 'de', 'dk'];

    for (const expected of nextExpected) {
      await fireEvent.click(button);
      expect(locale.value).toEqual(expected);
      expect(stored.value).toEqual(expected);
    }
  });
});
