import { Choices } from './Choices';

export interface TrueMage {
  name: string;
  choices: Choices;
}

export class TrueMage implements TrueMage {
  constructor() {
    this.name = 'True Mage';
    this.choices = {
      foundations: [],
      talents: [],
      bonds: [],
      threats: [],
    };
  }
}
