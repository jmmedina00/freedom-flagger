import { CONFIG_SIZING } from '@app/state';
import { useSomeConfig } from '../../config/options/plugin';
import { useCalculatedSizes } from '../../shared/sizing';

export const useFullStateSize = () => {
  const sizing = useSomeConfig(CONFIG_SIZING);
  return useCalculatedSizes(sizing);
};
