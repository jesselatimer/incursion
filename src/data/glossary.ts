import { keyBy } from 'lodash';

const IN_WORLD = [
  {
    singular: 'aether',
    plural: 'aether',
    description:
      'The amorphous metaphysical stuff that powers thaumaturgy, drawn up through conduits and expended in spells. Exists in many forms, and seems to be tied into the very fabric of the world.',
  },
  {
    singular: 'aspect',
    plural: 'aspects',
    description:
      "Any one of a thaumaturge's Source(s), Method(s), and Talent(s).",
  },
  {
    singular: 'circe',
    plural: 'circes',
    description:
      'A standardized unit of aether named for an ancient Greek sorceress. The smallest amount of aether necessary for a thaumaturge to affect the world. Typical usage is in kilocirces (kC) or megacirces (mC).',
  },
  {
    singular: 'kC',
    plural: 'kCs',
    description:
      'A standardized unit of aether named for an ancient Greek sorceress. The smallest amount of aether necessary for a thaumaturge to affect the world. Typical usage is in kilocirces (kC) or megacirces (mC).',
  },
  {
    singular: 'mC',
    plural: 'mCs',
    description:
      'A standardized unit of aether named for an ancient Greek sorceress. The smallest amount of aether necessary for a thaumaturge to affect the world. Typical usage is in kilocirces (kC) or megacirces (mC).',
  },
  {
    singular: 'conduit',
    plural: 'conduits',
    description:
      "A thaumaturge's means of accessing aether through a Source. Commonly thought of as a pipe that one draws magic through, with Endurance setting the initial diameter of this conduit and tax reducing it. It is slightly more accurate to say the conduit is the muscle one flexes to work magic, with Endurance determining endurance and tax acting as lactic build-up and glucose depletion.",
  },
  {
    singular: 'control',
    plural: 'control',
    description:
      'How well a thaumaturge is able to direct aether in spellwork. Affects the subtlety and efficiency of most spells, and often the scope of effect. (Often called skill or other synonyms.)',
  },
  {
    singular: 'curse',
    plural: 'curses',
    description:
      'A direct magical attack. Does not include attacks that create and direct mass or energy, nor attacks that summon. (e.g. Trial of Oblivion, some uses of Sortition, etc.)',
  },
  {
    singular: 'Incursion',
    plural: 'Incursion',
    description:
      'The historical event that shaped the current magical world, when the remnants of another world or dimension collided with ours.',
  },
  {
    singular: 'magic',
    plural: 'magic',
    description:
      'A poorly defined term, but including at least all acts of thaumaturgy.',
  },
  {
    singular: 'magical beast',
    plural: 'magical beasts',
    description:
      'A creature that benefits in some way from aether: in many cases, they absorb ambient energy to increase strength, speed, longevity, etc.. Most have special abilities close to Talents. Only sapient magical beasts are capable of casting tricks, and what they can cast is likely to be limited.',
  },
  {
    singular: 'reserve',
    plural: 'reserve',
    description:
      "A tax that persists as long as the associated magical effect does. Effectively lowers one's maximum available Endurance.",
  },
  {
    singular: 'tax',
    plural: 'tax',
    description:
      'How a given Source wears out a thaumaturge\'s conduit. Also an abstract “unit” of the the degree of wear on one\'s conduit. (e.g. "That last casting heavily taxed me.")',
  },
  {
    singular: 'thaumaturge',
    plural: 'thaumaturges',
    description:
      'A being with the ability to cast spells, which is known as thaumaturgy. Roughly 1 in 500 humans is a thaumaturge. ~14 million thaumaturges worldwide.',
  },
  {
    singular: 'thaumaturgy',
    plural: 'thaumaturgies',
    description:
      'An endowment of magical aspects that include one or more ways to gather aether (Sources); one or more ways to shape aether (Methods); and one or more ways to access specific domains of power (Talents).',
  },
  {
    singular: 'trick',
    plural: 'tricks',
    description:
      'The general body of spells that thaumaturges can cast without a need for Talents. (Sometimes called "small magic", "lesser magic", or "cantrips", among others.)',
  },
  {
    singular: 'true mage',
    plural: 'true mages',
    description:
      'A thaumaturge capable of arbitrarily mixing, matching, and acquiring new Sources, Methods, and Talents. Roughly 1 in 2000 thaumaturges is a true mage, ie, there are ~7000 true mages worldwide.',
  },
  {
    singular: 'spell',
    plural: 'spells',
    description:
      'An individual act of thaumaturgy. Usually a trick or active Talent effect.',
  },
  {
    singular: 'spirit',
    plural: 'spirits',
    description:
      'A category of being including almost all non-corporeal magical entities, and magic or effects that specifically interact with them.',
  },
  {
    singular: 'spiritual',
    plural: 'spiritual',
    description:
      'A category of being including almost all non-corporeal magical entities, and magic or effects that specifically interact with them.',
  },
];

export const CYOA = [
  {
    singular: 'Foundation',
    plural: 'Foundations',
    description:
      'Potential, Sources, and Methods. The necessary elements of thaumaturgy.',
  },
  {
    singular: 'Potential',
    plural: 'Potentials',
    description:
      "A combination of a thaumaturge's Power and Endurance, the raw ability to channel aether. Though slightly inaccurate, it is helpful to think of casting magic like working any other muscle, and Potential is a measure of that strength.",
  },
  {
    singular: 'Power',
    plural: 'Powers',
    description:
      'If casting magic is like flexing a muscle, Power represents fast-twitch strength, the amount of force a thaumaturge can bring to bear in a single casting. Just as a stronger person requires less effort to lift a given weight, more Power improves the efficiency of drawing aether, decreasing the amount of tax incurred for using a given amount.',
  },
  {
    singular: 'Endurance',
    plural: 'Endurances',
    description:
      "Endurance represents a thaumaturge's magical endurance. Or, if casting magic is like flexing a muscle, some combination of slow-twitch strength and cardiovascular health. Specific mechanics vary by Source.",
  },
  {
    singular: 'Source',
    plural: 'Sources',
    description:
      "A means by which a thaumaturge draws aether. A part of one's magical essence that acts as an interface with specific flavors of aether. e.g. Arcane Font, Necrophage, etc.",
  },
  {
    singular: 'Method',
    plural: 'Methods',
    description:
      'A means by which a thaumaturge transforms aether into spells. e.g. Pyromancer, Wizard, etc..',
  },
  {
    singular: 'Talent',
    plural: 'Talents',
    description:
      "A magical aspect intrinsic to a person's thaumaturgy that allows them to cast a specific kind of magic that those without the Talent cannot. e.g. Sortition, Master of Death.",
  },
  {
    singular: 'Bond',
    plural: 'Bonds',
    description:
      'An advantageous mystical connection with a person, power, thing, or organization.',
  },
  {
    singular: 'Ally',
    plural: 'Allies',
    description:
      'An individual practically fated to be a boon companion and ally.',
  },
  {
    singular: 'Contact',
    plural: 'Contacts',
    description:
      'An especially favorably disposed organization, person, or power; lacking the greater loyalty of an Ally.',
  },
  {
    singular: 'Pact',
    plural: 'Pacts',
    description:
      'A (typically permanent) contract or bond to a supernatural power.',
  },
  {
    singular: 'Artifact',
    plural: 'Artifacts',
    description:
      'Special magical items, often unique results of the Incursion.',
  },
  {
    singular: 'Threat',
    plural: 'Threats',
    description: 'A special, defined hazard or challenge afflicting the world.',
  },
];

export const IN_WORLD_TERMS = keyBy(IN_WORLD, 'singular');
export const CYOA_TERMS = keyBy(CYOA, 'singular');

export const IN_WORLD_TERMS_BY_PLURAL = keyBy(IN_WORLD, 'plural');
export const CYOA_TERMS_BY_PLURAL = keyBy(CYOA, 'plural');
