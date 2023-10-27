import React, { createContext, useCallback, useState } from 'react';
import '../css/App.css';
import { TrueMage } from '../models/TrueMage';
import { Choice } from '../models/Choice';
import { CategoryKey } from '../models/Category';
import { CATEGORIES, DEFAULT_TRUE_MAGE } from '../data';
import Page from './Page';
import ValidationToast from './ValidationToast';
import { calculatePoints } from '../utils/calculatePoints';
import { every } from 'lodash';
import { EntityKey } from '../models/Entity';

type TrueMageContext = {
  trueMage: TrueMage;
  setTrueMage: (trueMage: TrueMage) => void;
};
export const TrueMageContext = createContext<TrueMageContext>({
  trueMage: DEFAULT_TRUE_MAGE,
  setTrueMage: (_trueMage) => {},
});

type SetChoicesContext = (
  newChoices: Choice[],
  categoryKey: CategoryKey
) => void;
export const SetChoicesContext = createContext<SetChoicesContext>(
  (_newChoices, _categoryKey) => {}
);

export type ValidationState =
  | {
      show: false;
    }
  | {
      show: true;
      message: string;
    };

export const REQUIRED_ENTITY_KEYS: Record<CategoryKey, EntityKey[]> = {
  foundations: ['power', 'capacity'],
};

function App() {
  // TODO: have this read from local storage
  // TODO: implement multiple users (store each user in local storage, use state to set user)
  const [trueMage, setTrueMage] = useState<TrueMage>(DEFAULT_TRUE_MAGE);
  const [categoryChoices, setAllChoicesByCategory] = useState<
    Record<CategoryKey, Choice[]>
  >({
    foundations: [
      { entityKey: 'power', level: 1 },
      { entityKey: 'capacity', level: 1 },
    ],
  });
  const [showValidationError, setShowValidationError] =
    useState<ValidationState>({
      show: false,
    });

  const validateNewChoices = useCallback(
    (newChoices: Choice[], categoryKey: CategoryKey) => {
      const category = CATEGORIES[categoryKey];
      const pointType = category.pointType;
      if (!pointType) return true;

      const chosenEntityKeys = new Set(
        newChoices.map((choice) => choice.entityKey)
      );
      const includesRequiredChoices = every(
        REQUIRED_ENTITY_KEYS[category.key] || [],
        (key) => chosenEntityKeys.has(key)
      );
      if (!includesRequiredChoices) {
        setShowValidationError({
          show: true,
          message: `Cannot remove required choice.`,
        });
        return false;
      }

      const usedPoints = calculatePoints(newChoices, pointType.key);

      if (usedPoints > pointType.maxPoints) {
        const oldPoints = calculatePoints(
          categoryChoices[categoryKey] || [],
          pointType.key
        );
        setShowValidationError({
          show: true,
          message: `Not enough points to make selection. Current points: ${
            showValidationError.show
              ? ` ${oldPoints}/${pointType.maxPoints}`
              : ''
          }`,
        });
        return false;
      }
      return true;
    },
    [CATEGORIES, categoryChoices]
  );

  const setChoices = useCallback(
    (newChoices: Choice[], categoryKey: CategoryKey) => {
      const canMakeChoice = validateNewChoices(newChoices, categoryKey);
      if (!canMakeChoice) {
        return;
      }

      let newCategoryChoices = { ...categoryChoices };
      newCategoryChoices[categoryKey] = newChoices;

      setAllChoicesByCategory(newCategoryChoices);
    },
    [categoryChoices, setAllChoicesByCategory, setShowValidationError]
  );

  return (
    <TrueMageContext.Provider value={{ trueMage, setTrueMage }}>
      <SetChoicesContext.Provider value={setChoices}>
        <div style={{ position: 'relative' }}>
          <Page categoryChoices={categoryChoices} />
          <ValidationToast
            showValidationError={showValidationError}
            setShowValidationError={setShowValidationError}
          />
        </div>
      </SetChoicesContext.Provider>
    </TrueMageContext.Provider>
  );
}

export default App;
