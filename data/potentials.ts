import {
  FOUNDATION_TYPE,
  Potential,
} from '../src/models/foundations/Foundation';

export const POTENTIALS: Potential[] = [
  {
    key: 'power',
    label: 'Power',
    description:
      'The amount of aether you can put into one spell. The base rate of tax per circe used to cast spells.',
    type: FOUNDATION_TYPE.Potential,
  },
  {
    key: 'capacity',
    label: 'Capacity',
    description:
      'Increases the amount of aether you can channel before being totally taxed. (Details depend on Source.)',
    type: FOUNDATION_TYPE.Potential,
  },
];
