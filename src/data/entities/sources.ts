import { Entity, EntityKey } from '../../models/Entity';
import { CATEGORIES } from '../categories';

export const SOURCES: Record<EntityKey, Entity> = {
  arcane_font: {
    key: 'arcane_font',
    label: 'Arcane Font',
    description:
      'Your sense of the world is awash with the flow of aether, a cool wind that caresses your soul. You may extract aether from the geomantic energy present in the environment. Extracting aether diminishes the available energy, and there are many places where a single dedicated Thaumaturge could tap a locale dry for a time, though it will regenerate, usually in about a week. The less energy in a locale (whether naturally or as a result of thaumaturgy) the less aether a given draw extracts, and vice versa. Natural saturation of the Earth’s energy varies from place to place: the world is a patchwork with varying peak levels, speed of regeneration, and the size of what counts as one locale. Variance in peak levels is not high, with only a bare handful of rare places with twice as much energy. Arcane Font grants you the passive ability to sense the flow of geomantic energy, meaning you naturally understand the quality of local energy, as well as that of adjacent regions, and can also tell the direction and strength of any nearby draws via Arcane Font. Arcane Font is a common Source, and is often the baseline for comparison with other Sources.',
    category: CATEGORIES.foundations,
    subCategory: 'Sources',
    imageUrl: '/images/arcane_font.jpg',
  },
  bonds_of_spirit: {
    key: 'bonds_of_spirit',
    label: 'Bonds of Spirit',
    description:
      'Somewhere in the back of your mind is a buzz of whispers, a perpetual rippling exchange of trades and offers. You have a connection to a colloquy of great spirits and forces, as well as other thaumaturges, and so participate in a “spiritual energy market” from which you may obtain aether. The market is mostly robust, and in the long term, the median amount of aether for a given strength draw is ~110% compared to reference Arcane Font; however, there are lulls and spikes, as well as boom and bust periods where for hours to months draws may be up to twice or half as efficient. You will know exactly what rate you’ll receive at any given moment, but predicting the market in advance is about as difficult as predicting the real world economic market. On the downside, as part of participating on the market, at times your own spiritual energy becomes “illiquid”: almost randomly, one to four times a week, a few percent of your conduit is reserved. This condition lasts about a day. Your connection to the spiritual market gives you a type of vague sense of the global magical happenings, meaning you have a chance to notice if something very significant happens, as if a million brokers cried out and were suddenly silent (such as a mass migration or die off of magical beings, major thaumaturgical battles, a world affecting ritual, etc).',
    category: CATEGORIES.foundations,
    subCategory: 'Sources',
    imageUrl: '/images/bonds_of_spirit.jpg',
  },
};
