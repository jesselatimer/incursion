import { createContext, useCallback, useEffect, useState } from 'react';
import '../css/App.css';
import { TrueMage } from '../models/TrueMage';
import { Choice } from '../models/Choice';
import { CategoryKey } from '../models/Category';
import {
  DEFAULT_TRUE_MAGE,
  getChoicesFromLocalStorage,
  getTrueMagesFromStorage,
  initialChoices,
} from '../data';
import { DataByKey, getDataFromImport } from '../utils/importData';
import ValidationToast from './ValidationToast';
import { every } from 'lodash';
import { EntityKey } from '../models/Entity';
import { Outlet, ScrollRestoration, useLoaderData } from 'react-router-dom';
import Navbar from './Navbar';
import { Container, Image } from 'react-bootstrap';
import { HashLink } from 'react-router-hash-link';
import Home from './Home';

type TrueMageContextType = {
  trueMage: TrueMage;
  setTrueMage: (trueMage: TrueMage) => void;
};
export const TrueMageContext = createContext<TrueMageContextType>({
  trueMage: DEFAULT_TRUE_MAGE,
  setTrueMage: (_trueMage) => {},
});

const { currentTrueMage } = getTrueMagesFromStorage();

const defaultDataContext: DataByKey = {
  categoriesByKey: {},
  subCategoriesByKey: {},
  entitiesByKey: {},
  entityLevelsByKey: {},
  pointTypesByKey: {},
  appendicesByKey: {},
  setting: '',
};
export const DataContext = createContext<DataByKey>(defaultDataContext);

type CategoryChoicesContextType = {
  setChoices: (newChoices: Choice[], categoryKey: CategoryKey) => void;
  categoryChoices: Record<CategoryKey, Choice[]>;
};

export const CategoryChoicesContext = createContext<CategoryChoicesContextType>(
  {
    setChoices: (_newChoices, _categoryKey) => {},
    categoryChoices: {},
  }
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
  foundations: ['power', 'endurance'],
};

function App() {
  const [dataByKey, setDataByKey] = useState<DataByKey>();

  useEffect(() => {
    getDataFromImport().then((data) => {
      setDataByKey(data);
    });
  }, []);

  const [trueMage, setTrueMage] = useState<TrueMage>(currentTrueMage);
  const [categoryChoices, setAllChoicesByCategory] = useState<
    Record<CategoryKey, Choice[]>
  >(getChoicesFromLocalStorage(currentTrueMage) || initialChoices);

  const setTrueMageAndChoices = useCallback((trueMage: TrueMage) => {
    setTrueMage(trueMage);
    setAllChoicesByCategory(
      getChoicesFromLocalStorage(trueMage) || initialChoices
    );
  }, []);

  const [showValidationError, setShowValidationError] =
    useState<ValidationState>({
      show: false,
    });

  const validateNewChoices = useCallback(
    (newChoices: Choice[], categoryKey: CategoryKey) => {
      if (!dataByKey) return true;

      const category = dataByKey.categoriesByKey[categoryKey];
      const pointTypeKey = category.pointType;
      if (!pointTypeKey) return true;

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

      return true;
    },
    [dataByKey]
  );

  const setChoices = useCallback(
    (newChoices: Choice[], categoryKey: CategoryKey) => {
      const canMakeChoice = validateNewChoices(newChoices, categoryKey);
      if (!canMakeChoice) {
        return;
      }

      let newCategoryChoices = { ...categoryChoices };
      newCategoryChoices[categoryKey] = newChoices;

      localStorage.setItem(
        trueMage.id.toString(),
        JSON.stringify(newCategoryChoices)
      );
      setAllChoicesByCategory(newCategoryChoices);
    },
    [categoryChoices, setAllChoicesByCategory, validateNewChoices, trueMage]
  );

  if (dataByKey === undefined) {
    return (
      <>
        <Navbar />
        <Container fluid style={{ padding: '20px', margin: '0' }}>
          <Home />
        </Container>
      </>
    );
  }

  return (
    <TrueMageContext.Provider
      value={{ trueMage, setTrueMage: setTrueMageAndChoices }}
    >
      <DataContext.Provider value={dataByKey}>
        <CategoryChoicesContext.Provider
          value={{ setChoices, categoryChoices }}
        >
          <ScrollRestoration />
          <HashLink to="#">
            <Image
              src="/incursion/up-chevron.png"
              roundedCircle
              style={{
                width: '35px',
                height: '35px',
                position: 'fixed',
                bottom: '10px',
                left: '10px',
                zIndex: '10000000000000',
                backgroundColor: 'white',
                borderRadius: '999px',
                padding: '5px',
              }}
            />
          </HashLink>
          <div style={{ position: 'relative' }}>
            <Navbar />
            <Container fluid style={{ padding: '20px', margin: '0' }}>
              <Outlet />
            </Container>
            <ValidationToast
              showValidationError={showValidationError}
              setShowValidationError={setShowValidationError}
            />
          </div>
        </CategoryChoicesContext.Provider>
      </DataContext.Provider>
    </TrueMageContext.Provider>
  );
}

export default App;
