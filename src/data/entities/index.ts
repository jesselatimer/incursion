import { ALLIES } from './allies';
import {} from './artifacts';
import {} from './contacts';
import { METHODS } from './methods';
import {} from './pacts';
import { POTENTIALS } from './potentials';
import { SOURCES } from './sources';
import { TALENTS } from './talents';
import {} from './threats';

export const ALL_ENTITIES = {
  ...POTENTIALS,
  ...SOURCES,
  ...METHODS,
  ...TALENTS,
  ...ALLIES,
};
