import type { Foundation } from './foundations/Foundation';

export interface TrueMage {
  foundations: Foundation[];
}

export class TrueMage implements TrueMage {
  constructor() {
    this.foundations = [];
  }
}
