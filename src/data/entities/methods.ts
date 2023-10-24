import { Entity, EntityKey } from '../../models/Entity';
import { CATEGORIES } from '../categories';

// TODO: why aren't line breaks working?
export const METHODS: Record<EntityKey, Entity> = {
  artificer: {
    key: 'artificer',
    label: 'Artificer',
    description:
      "Tools and devices hum beneath your touch, eager to release their power. As an Artificer, you fashion strange devices that can channel your aether and create magical effects. Those most compatible with Artifice have an engineering mindset, a willingness to tinker and experiment even when they’re uncertain about the underlying theory, to try to get the most out of a given design. Improving aether control happens in the workshop, trying out new designs and components; field testing provides valuable insights, an artificer that doesn't spend time in the shop never improves.Your tools are obviously not mundane devices whether to mundane or magical senses, and when activated it’s usually obvious that they’re the source of a magical effect. Your devices are specific to you: you can’t use ones made by other artificers, nor they yours. You must be able to operate your device (at the very least touch a button) to empower it. Artificer devices are each a balancing act. Making them larger (up to non-portable), or of more expensive and fragile materials can make them more efficient at using aether, and capable of more complex effects. Making one device capable of more effects makes it slower and harder to use; for example an instant-on, one-button effect is extremely limited in scope, while a device that can do any spell you can cast would require hours of programming-like interaction for each one. Artificers gain an instinctive understanding of how to design and work with objects in 3D space. Artificers usually find it trivial to make devices for tricks with simple physical effects.\n\nArtifice has mild benefits to magic that has direct physical effects (eg, telekinesis), and slight penalties with ones that are the most spiritual or indirect in nature (eg, Sortition, curses).",
    subCategory: 'Methods',
    category: CATEGORIES.foundations,
    imageUrl: '/images/artificer.jpg',
    levels: [
      {
        pointCost: 0,
      },
    ],
  },
  lightweaver: {
    key: 'lightweaver',
    label: 'Lightweaver',
    description:
      'The stars, the moon, the sun, every source of light falls upon you with a sparkling pressure, scintillating against your nerves. A Lightweaver physically grasps light and knits or tangles it into a particular shape to cast their spell. The best lightweavers are those with strong, steady hands and an aesthetic appreciation for handicrafts. There’s not else for it to improve aether control except hour upon hour of practice, but studying different types of design and the nature of light will help. Lightweavers work sunlight, moonlight, and starlight; other lights work, but are less effective. Brighter lights block weaker ones: stars may technically shine during the day, but you can’t use their light then; and a day moon is weaker than a night one. The amount of light available puts a ceiling on the amount of aether you can practically turn into a magical effect; no light means no magic. Mirrors are generally smaller than the sky, so they reflect less light, but the nature of the light itself isn’t changed (though a very poor or strange mirror might turn it into artificial light). You can store one type of light in your body, enough to fill with a maximum strength draw, and release it at will, whether to illuminate or to weave. Lightweavers need both their hands free to weave their effects, though theoretically weaving with other parts of your body is possible, just don’t expect it to be fast or easy. Lightweavers can intuitively cast almost any trick related to illumination.\n\nYour advantaged and disadvantaged spells rely on the type of light available to you. The quantity of light is a factor, with more improving the advantage.\nSunlight: Big bonus to effects that generate force; small disadvantage to any other effects.\nMoonlight: Moderate bonus to illusion, misdirection, transformation, mental and social effects.\nStarlight: Moderate bonus to information and fate manipulation; big disadvantage to physical effects.\nArtificial: Small benefit to conjuration and crafting; big disadvantage to the rest.\nFirelight: Small benefit to direct use of force; big disadvantage to the rest.\nBioluminescence: Small benefit to body affecting; big disadvantage to the rest.',
    subCategory: 'Methods',
    category: CATEGORIES.foundations,
    imageUrl: '/images/lightweaver.jpg',
    levels: [
      {
        pointCost: 0,
      },
    ],
  },
};
