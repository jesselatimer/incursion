import React, { createContext, useCallback, useState } from 'react';
import '../css/App.css';
import { TrueMage } from '../models/TrueMage';
import { Choice } from '../models/Choice';
import { CategoryKey } from '../models/Category';
import {
  CATEGORIES,
  DEFAULT_TRUE_MAGE,
  POINT_CALCULATORS,
  POINT_TYPES,
} from '../data';
import Page from './Page';
import ValidationToast from './ValidationToast';
import { ALL_ENTITIES } from '../data/entities';

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

const validateNewChoices = (newChoices: Choice[], categoryKey: CategoryKey) => {
  console.log('validateNewChoices');
  console.log('newChoices', newChoices);
  const category = CATEGORIES[categoryKey];
  console.log('category', category);
  const pointType = category.pointType;
  console.log('pointType', pointType);
  if (!pointType) return true;

  // const pointCalculator = POINT_CALCULATORS[pointType.key];
  let usedPoints = 0;
  for (const choice of newChoices) {
    const entity = ALL_ENTITIES[choice.entityKey];
    const levels = entity.levels.slice(0, choice.value + 1); // TODO ensure getting correct values here
    console.log('levels' + entity.label, levels);
    for (const level of levels) {
      usedPoints += level.pointCost;
    }
  }
  // TODO: add point calculator here, may need to rework
  return usedPoints <= pointType.startingValue;
};

function App() {
  // TODO: have this read from local storage
  // TODO: implement multiple users (store each user in local storage, use state to set user)
  const [trueMage, setTrueMage] = useState<TrueMage>(DEFAULT_TRUE_MAGE);
  const [categoryChoices, setAllChoicesByCategory] = useState<
    Record<CategoryKey, Choice[]>
  >({});
  const [showValidationError, setShowValidationError] =
    useState<boolean>(false);

  const setChoices = useCallback(
    (newChoices: Choice[], categoryKey: CategoryKey) => {
      const canMakeChoice = validateNewChoices(newChoices, categoryKey);
      if (!canMakeChoice) {
        setShowValidationError(true);
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
