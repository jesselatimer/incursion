import React, { ReactNode, createContext, useCallback, useState } from 'react';
import '../css/App.css';
import { TrueMage } from '../models/TrueMage';
import { Choice } from '../models/Choice';
import { CategoryKey } from '../models/Category';
import { DEFAULT_TRUE_MAGE } from '../data';

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

function ContextProvider({
  children,
  state: { trueMage, setTrueMage, categoryChoices, setAllChoicesByCategory },
}: {
  children: ReactNode;
  state: {
    trueMage: TrueMage;
    setTrueMage: (trueMage: TrueMage) => void;
    categoryChoices: Record<CategoryKey, Choice[]>;
    setAllChoicesByCategory: (
      newCategoryChoices: Record<CategoryKey, Choice[]>
    ) => void;
  };
}) {
  const setChoices = useCallback(
    (newChoices: Choice[], categoryKey: CategoryKey) => {
      let newCategoryChoices = { ...categoryChoices };
      newCategoryChoices[categoryKey] = newChoices;

      setAllChoicesByCategory(newCategoryChoices);
    },
    [categoryChoices, setAllChoicesByCategory]
  );

  return (
    <TrueMageContext.Provider value={{ trueMage, setTrueMage }}>
      <SetChoicesContext.Provider value={setChoices}>
        {children}
      </SetChoicesContext.Provider>
    </TrueMageContext.Provider>
  );
}

export default ContextProvider;
