import { CategoryKey } from '../models/Category';
import { Choice } from '../models/Choice';
import { TrueMage } from '../models/TrueMage';

export const initialChoices: Record<CategoryKey, Choice[]> = {
  foundations: [
    { entityKey: 'power', level: 1 },
    { entityKey: 'endurance', level: 1 },
  ],
};

export const getChoicesFromLocalStorage = (trueMage: TrueMage) => {
  const choicesFromStorageJson = localStorage.getItem(trueMage.id.toString());
  if (choicesFromStorageJson) {
    const choicesFromStorage: Record<CategoryKey, Choice[]> = JSON.parse(
      choicesFromStorageJson
    );
    return choicesFromStorage;
  }
};
