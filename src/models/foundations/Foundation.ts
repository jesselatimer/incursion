export enum FOUNDATION_TYPE {
  Potential = 'potential',
  Source = 'source',
  Method = 'method',
}

export interface Foundation {
  key: string;
  label: string;
  description: string;
  type: FOUNDATION_TYPE;
}

export interface Potential extends Foundation {
  type: FOUNDATION_TYPE.Potential;
}

export interface Source extends Foundation {
  type: FOUNDATION_TYPE.Source;
}

export interface Method extends Foundation {
  type: FOUNDATION_TYPE.Method;
}
