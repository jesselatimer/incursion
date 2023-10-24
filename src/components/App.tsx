import React, { createContext, useCallback, useState } from 'react';
import '../css/App.css';
import { TrueMage } from '../models/TrueMage';
import { Choice } from '../models/Choice';
import { CategoryKey } from '../models/Category';
import { DEFAULT_TRUE_MAGE } from '../data';
import Page from './Page';
import ValidationToast from './ValidationToast';

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
  return false;
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
