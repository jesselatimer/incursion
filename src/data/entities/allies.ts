import { EntityKey, Entity } from '../../models/Entity';
import { CATEGORIES } from '../categories';

export const ALLIES: Record<EntityKey, Entity> = {
  the_scholar_of_ages: {
    key: 'the_scholar_of_ages',
    label: 'The Scholar of Ages, Ambrocio Anwar',
    description:
      "This grizzled old man of indistinct ethnicity tells you he is a thousand years old (whether you believe him or not is up to you, but he sure does seem to have an intimate knowledge of history). Whatever else, he is certainly a polymath of rare talent. He has a clearly supernatural memory, and has used it to accumulate a stock of knowledge both broad and deep. He is a competent teacher and can tutor you in science, mathematics, philosophy, history, engineering, the humanities, medicine, or nearly anything else. Though he looks old, he is as spry as a youth, strong and enduring, and seems immune to disease. Though most of his knowledge is intellectual rather than practiced, he’s quite competent at martial arts, and will train you in that as well. Thaumaturgy: Inner Medicine Ambrocio draws aether through Dan'Tien, and casts magic through a combination of small paper talismans and meditation. His magic is primarily that of protection and fortification, though his stock of magical tricks is as broad as the rest of his learning, and his grasp on the theory is sound enough that he can probably adapt and teach you many regardless of your specific Method. Additionally, his martial arts have supernatural aspects, though it's unclear how much of that is the martial art itself, and how much is due to his preternatural strength and agility.",
    category: CATEGORIES.bonds,
    subCategory: 'Allies',
    imageUrl: '/images/the_scholar_of_ages.jpg',
    levels: [
      {
        pointCost: 2,
      },
    ],
  },
  the_soldier_of_fortune: {
    key: 'the_soldier_of_fortune',
    label: 'The Soldier of Fortune, Betty Liechtenstein',
    description:
      "Her name is short for Bethany, but do not call her this if you value your current organ arrangement. Betty is grim, unflappable, and hard-as-nails. What has the Incursion done but slightly changed the shapes of the things she shoots at? At 6’3” and 200 lbs, she has the musculature and conditioning of an Olympic multi-athlete; once-in-a-generation reflexes; the instincts of a natural fighter and sharpshooter; and a genius-level grasp of tactics and strategy. She is skilled in the use and maintenance of nearly any kind of weapon, and she can drive most vehicles. As one of the world’s most talented independent military contractors, she’s amassed a good amount of money, but she’s spent most of it on more gear. In fair fights, and most unfair ones, it's safe to bet on Betty. Arsenal: Magic Guns Betty has access to a personal armament of staggering size; and if she ever needs something else, she has hidden caches of gear strewn across the world. Her weapons penetrate magical defenses, her projectiles fly truer and hit harder, and her armor is plated in anti-magic shields that protect her from all but the hardest mystical hits. Special goggles give her vastly enhanced senses, nearly-invisible military drones give her a birds-eye view of the battlefield, and a light but durable exoskeleton enhances her strength and agility well beyond even her own staggering heights.",
    category: CATEGORIES.bonds,
    subCategory: 'Allies',
    imageUrl: '/images/the_soldier_of_fortune.jpg',
    levels: [
      {
        pointCost: 2,
      },
    ],
  },
};
