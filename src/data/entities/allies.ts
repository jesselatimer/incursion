import { EntityKey, Entity } from '../../models/Entity';
import { CATEGORIES } from '../categories';

export const ALLIES: Record<EntityKey, Entity> = {
  the_soldier_of_fortune: {
    key: 'the_soldier_of_fortune',
    label: 'The Soldier of Fortune, Betty Liechtenstein',
    description:
      "Her name is short for Bethany, but do not call her this if you value your current organ arrangement. Betty is grim, unflappable, and hard-as-nails. What has the Incursion done but slightly changed the shapes of the things she shoots at? At 6’3” and 200 lbs, she has the musculature and conditioning of an Olympic multi-athlete; once-in-a-generation reflexes; the instincts of a natural fighter and sharpshooter; and a genius-level grasp of tactics and strategy. She is skilled in the use and maintenance of nearly any kind of weapon, and she can drive most vehicles. As one of the world’s most talented independent military contractors, she’s amassed a good amount of money, but she’s spent most of it on more gear. In fair fights, and most unfair ones, it's safe to bet on Betty. Arsenal: Magic Guns Betty has access to a personal armament of staggering size; and if she ever needs something else, she has hidden caches of gear strewn across the world. Her weapons penetrate magical defenses, her projectiles fly truer and hit harder, and her armor is plated in anti-magic shields that protect her from all but the hardest mystical hits. Special goggles give her vastly enhanced senses, nearly-invisible military drones give her a birds-eye view of the battlefield, and a light but durable exoskeleton enhances her strength and agility well beyond even her own staggering heights.",
    category: CATEGORIES.bonds,
    subCategory: 'Allies',
    imageUrl: '/images/the_soldier_of_fortune.jpg',
  },
};
