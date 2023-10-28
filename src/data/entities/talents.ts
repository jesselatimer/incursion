import { Entity, EntityKey } from '../../models/Entity';
import { CATEGORIES } from '../categories';

export const TALENTS: Record<EntityKey, Entity> = {
  door_lord: {
    key: 'door_lord',
    label: 'Door Lord',
    description: `In a grand ceremony you have been inducted into a particular aristocracy. Paths and ways press upon your senses, a portal from &ldquo;here&rdquo; to &ldquo;there&rdquo; everywhere you lay your eyes. It is dizzying, but the spells you can call up from those strange maps are worth it. Door Lord lets you cast spells to make doors; first through walls, then to fantastic places.</span></p><p class="c3"><span class="c1">Inherent: You gain a kind of instinct and memory for doors; you have an impression of where the closest ones are, especially if you&rsquo;re touching a wall they go through; you&rsquo;ll never push a pull door or vice versa; you guess right more often than not on whether a door is locked, if the key is nearby you can find it easily, and if it&rsquo;s electronic lock, you have an impression of where the control is; if you have a key you can tell if the door it goes to is nearby. You can guess much better than chance if somebody is about to come through or just went through a door.</span></p><p class="c3"><span class="c1">Spells:</span></p><ul class="c13 lst-kix_ml4x5anxggaq-0 start"><li class="c0 li-bullet-0"><span class="c1">You can cast divination spells that are built on your inherent door instincts, but are longer range and more accurate and specific.</span></li><li class="c0 li-bullet-0"><span class="c1">You may create temporary doors through solid barriers. By default they look like a faintly exotic door from your own memory or imagination, but if you&rsquo;re skilled at molding aether, you can make it look like any type of portal; it is not possible to camouflage its existence as a door. No matter how long the door&rsquo;s passage should be, even if it&rsquo;s through a mountain, it never looks or feels more than a foot or so deep. Costs are based on how thick and strong the wall or barrier is; it&rsquo;s more expensive to make portals through barriers that aren&rsquo;t proper manmade walls. Costs raise exponentially for thickness. Duration is increased greatly when you&rsquo;re touching your door, so it is low cost to make a door that exists only long enough for you to go through it; but a typical energy expenditure will last half an hour.`,
    category: CATEGORIES.talents,
    subCategory: 'Talents',
    imageUrl: '/images/door_lord.jpg',
    levels: [
      {
        pointCost: 2,
        description: `<p class="c3"><span class="c1">Spells:</span></p><ul class="c13 lst-kix_ml4x5anxggaq-0 start"><li class="c0 li-bullet-0"><span class="c1">You can cast divination spells that are built on your inherent door instincts, but are longer range and more accurate and specific.</span></li><li class="c0 li-bullet-0"><span class="c1">You may create temporary doors through solid barriers. By default they look like a faintly exotic door from your own memory or imagination, but if you&rsquo;re skilled at molding aether, you can make it look like any type of portal; it is not possible to camouflage its existence as a door. No matter how long the door&rsquo;s passage should be, even if it&rsquo;s through a mountain, it never looks or feels more than a foot or so deep. Costs are based on how thick and strong the wall or barrier is; it&rsquo;s more expensive to make portals through barriers that aren&rsquo;t proper manmade walls. Costs raise exponentially for thickness. Duration is increased greatly when you&rsquo;re touching your door, so it is low cost to make a door that exists only long enough for you to go through it; but a typical energy expenditure will last half an hour.</span></li></ul>`,
      },
      {
        pointCost: 4,
        description: `<p class="c3"><span class="c1">Lvl 2:</span></p><ul class="c13 lst-kix_9nuxal6jvu3c-0 start"><li class="c0 li-bullet-0"><span class="c1">You may cast a spell on doors causing them to open to the Hall of Doors. This extradimensional space is a vast, shifting labyrinth of many materials and forms, laid out in strange and twisting paths: but every wall is lined with doors of every possible type and appearance. These doors connect to every door in the primary world (and more besides), so you need only open one to return to Earth, unless the corresponding door is open in the real world, in which case the Hall door cannot be affected. The distance between doors in The Hall is correlated with their distance in the real world, but almost always much closer together, making it easy to rapidly travel between human occupied areas. Because of the terrain, including narrow halls, bridges, stairs, etc, vehicles are hard to use there, and even riding animals is difficult. It is occasionally occupied, both by other thaumaturges with access, and by stranger things. The layout shifts at times.</span></li><li class="c0 li-bullet-0"><span class="c1">In The Hall you may cast divination spells to find a specific door (or perhaps with enough skill and by combining with other divinations, doors meeting some criteria, eg, &ldquo;Near my friend,&rdquo;). Divination may fail without enough aether, which is required based on the door&rsquo;s distance from the last place you were in the real world, and how secured the door is.</span></li></ul>`,
      },
      {
        pointCost: 4,
        description: `<p class="c3"><span class="c1">Lvl 3:</span></p><ul class="c13 lst-kix_9nuxal6jvu3c-0"><li class="c0 li-bullet-0"><span>You may now create glassy looking doors that appear free-standing in mid-air and open to a dim and ghostly space known as &ldquo;the Backside of the World,&rdquo; as well as doors from the backside to the front. These doors cease to exist as soon as you close them. Only those with specialized supernatural senses or magic can even perceive someone in the backside from the frontside, and it is a rare magic (other than another Door Lord) that can cause harm from one side to the other. You can only access a small area of the Backside around your entry point: as you move away, it gets even darker, and harder to think and breathe, and more expensive to make an exit door. An average expenditure gives you ten meters, twenty to thirty if you push. This range shrinks by about half every two hours, though a recast can expand it again without having to open a new door.</span></li></ul>`,
      },
    ],
  },
  brass_skin: {
    key: 'brass_skin',
    label: 'Bonds of Spirit',
    description:
      'The heat of the forge, the beat of the hammer and tongs, echoes in your skin. This Talent lets you cast spells to physically transform yourself to a more durable form. Inherent: Your skin becomes a bit tougher, especially to heat, but less sensitive; you tan more easily (even if you were previously an albino!), and are unlikely to get sunburned.',
    category: CATEGORIES.talents,
    subCategory: 'Talents',
    imageUrl: '/images/brass_skin.jpg',
    levels: [
      {
        pointCost: 5,
        description:
          'Spells: Brass Skin spells cause physical transformations. They turn your skin and most clothing a burnished brass color. This “brazing” has the following effects: In proportion to the energy you invest in a Brass Skin spell your mass increases, your limbs become stiffer, and you become much more durable. An average amount of aether slows you by ~20%, and makes you completely immune to typical handgun calibers, and very resistant to rifle ones. You (and items affected) become non-flammable, very resistant to heat and to corrosive substances. The brass radiates heat and ignites flammable objects. Your burnished skin resists and can even reflect magic that directly interacts with you. Sufficient skill allows you to control which is emphasized relative to another, but you can’t separate effects, eg, you can’t become more resistant to corrosion than acid, or reflect magic without burning things. Typical aether expenditure lasts about ten minutes, but each doubling of the duration costs less than double aether.',
      },
    ],
  },
};
