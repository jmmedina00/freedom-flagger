import { beforeEach, describe, expect, test, vi } from 'vitest';
import {
  getLocaleFromBrowser,
  getLocaleFromLocalStorage,
  getLocaleFromPath,
  getLocaleFromQuery,
} from './i18n.detect';

vi.mock('./i18n', () => ({
  SUPPORTED_LOCALES: ['es', 'en', 'fr'],
}));

describe('i18n locale fetching', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  describe('local storage', () => {
    test('should pull locale stored in local storage', () => {
      const storage = {
        getItem: vi.fn().mockReturnValue('es'),
      };

      vi.stubGlobal('localStorage', storage);
      const locale = getLocaleFromLocalStorage();

      expect(locale).toEqual('es');
      expect(storage.getItem).toHaveBeenCalledWith('lang');
    });

    test('should return undefined gracefully if locale is missing', () => {
      const storage = {
        getItem: vi.fn().mockReturnValue(null),
      };

      vi.stubGlobal('localStorage', storage);
      const locale = getLocaleFromLocalStorage();

      expect(locale).toBeFalsy();
    });

    test('should return undefined gracefully if web storage is not accessible', () => {
      const locale = getLocaleFromLocalStorage();
      expect(locale).toBeFalsy();
    });
  });

  describe('query string', () => {
    test('should return locale from query string', () => {
      vi.stubGlobal('location', { href: 'http://foo.com/bar?lang=fr' });

      const locale = getLocaleFromQuery();
      expect(locale).toEqual('fr');
    });

    test('should return undefined gracefully if improper value is present', () => {
      vi.stubGlobal('location.href', { href: 'http://foo.com/bar?lang=wut' });

      const locale = getLocaleFromQuery();
      expect(locale).toBeFalsy();
    });

    test('should return undefined gracefully if no query is present', () => {
      vi.stubGlobal('location.href', {
        href: 'http://foo.com/bar?what=isthis',
      });

      const locale = getLocaleFromQuery();
      expect(locale).toBeFalsy();
    });

    test('should return undefined gracefully if location.href is not reachable', () => {
      const locale = getLocaleFromQuery();
      expect(locale).toBeFalsy();
    });
  });

  describe('path', () => {
    test('should return locale from path', () => {
      vi.stubGlobal('location', { href: 'http://foo.com/en' });

      const locale = getLocaleFromPath();
      expect(locale).toEqual('en');
    });

    test('should return FIRST locale from path', () => {
      vi.stubGlobal('location', { href: 'http://foo.com/es/en/fr' });

      const locale = getLocaleFromPath();
      expect(locale).toEqual('es');
    });

    test('should return undefined gracefully if no appropriate path fragment can be found', () => {
      vi.stubGlobal('location', { href: 'http://foo.com/unrelated/stuff' });

      const locale = getLocaleFromPath();
      expect(locale).toBeFalsy();
    });

    test('should return undefined gracefully if location.href is not reachable', () => {
      const locale = getLocaleFromPath();
      expect(locale).toBeFalsy();
    });
  });

  describe('navigator', () => {
    test('should return language part of locale from navigator', () => {
      const browser = {
        language: 'en-GB',
      };
      vi.stubGlobal('navigator', browser);

      const locale = getLocaleFromBrowser();
      expect(locale).toEqual('en');
    });

    test('should return undefined gracefully if access to navigator is not possible', () => {
      const browser = null;
      vi.stubGlobal('navigator', browser); // happy-dom already implements navigator, need to disable that

      const locale = getLocaleFromBrowser();
      expect(locale).toBeFalsy();
    });
  });
});
