import { REQUIRED_ENTITY_KEYS } from '../components/App';
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

export const addChoice = ({
  level,
  choices,
  entityKey,
  categoryKey,
  setChoices,
}: {
  level: number;
  choices: Choice[];
  entityKey: string;
  categoryKey: string;
  setChoices: (newChoices: Choice[], categoryKey: string) => void;
}) => {
  setChoices(
    [
      ...choices.filter((choice) => choice.entityKey !== entityKey),
      { entityKey, level },
    ],
    categoryKey
  );
};

export const removeChoice = ({
  choices,
  entityKey,
  categoryKey,
  setChoices,
}: {
  choices: Choice[];
  entityKey: string;
  categoryKey: string;
  setChoices: (newChoices: Choice[], categoryKey: string) => void;
}) => {
  // If entity is required, just set it to minimum level
  if (REQUIRED_ENTITY_KEYS[categoryKey]?.includes(entityKey)) {
    setChoices(
      [
        ...choices.filter((choice) => choice.entityKey !== entityKey),
        {
          entityKey: entityKey,
          level: 1,
        },
      ],
      categoryKey
    );
  } else {
    setChoices(
      choices.filter((choice) => choice.entityKey !== entityKey),
      categoryKey
    );
  }
};
