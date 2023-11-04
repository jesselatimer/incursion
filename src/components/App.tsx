import { createContext, useCallback, useEffect, useState } from 'react';
import '../css/App.css';
import { TrueMage } from '../models/TrueMage';
import { Choice } from '../models/Choice';
import { Category, CategoryKey } from '../models/Category';
import { DEFAULT_TRUE_MAGE } from '../data';
import { DataByKey } from '../utils/importData';
import ValidationToast from './ValidationToast';
import { calculatePoints } from '../utils/calculatePoints';
import { every } from 'lodash';
import { Entity, EntityKey } from '../models/Entity';
import { SubCategory, SubCategoryKey } from '../models/SubCategory';
import { EntityLevel, EntityLevelKey } from '../models/EntityLevel';
import { PointType, PointTypeKey } from '../models/PointType';
import { Outlet, useLoaderData } from 'react-router-dom';
import Summary from './Summary';
import Navbar from './Navbar';
import { Col, Container, Row } from 'react-bootstrap';

type TrueMageContext = {
  trueMage: TrueMage;
  setTrueMage: (trueMage: TrueMage) => void;
};
export const TrueMageContext = createContext<TrueMageContext>({
  trueMage: DEFAULT_TRUE_MAGE,
  setTrueMage: (_trueMage) => {},
});

type DataContext = {
  categoriesByKey: Record<CategoryKey, Category>;
  subCategoriesByKey: Record<SubCategoryKey, SubCategory>;
  entitiesByKey: Record<EntityKey, Entity>;
  entityLevelsByKey: Record<EntityLevelKey, EntityLevel>;
  pointTypesByKey: Record<PointTypeKey, PointType>;
  setting: string;
};
const defaultDataContext: DataContext = {
  categoriesByKey: {},
  subCategoriesByKey: {},
  entitiesByKey: {},
  entityLevelsByKey: {},
  pointTypesByKey: {},
  setting: '',
};
export const DataContext = createContext<DataContext>(defaultDataContext);

type CategoryChoicesContext = {
  setChoices: (newChoices: Choice[], categoryKey: CategoryKey) => void;
  categoryChoices: Record<CategoryKey, Choice[]>;
};

export const CategoryChoicesContext = createContext<CategoryChoicesContext>({
  setChoices: (_newChoices, _categoryKey) => {},
  categoryChoices: {},
});

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

let initialChoices: Record<CategoryKey, Choice[]> = {
  foundations: [
    { entityKey: 'power', level: 1 },
    { entityKey: 'capacity', level: 1 },
  ],
};
const choicesFromStorageJson = localStorage.getItem(DEFAULT_TRUE_MAGE.name);
if (choicesFromStorageJson) {
  const choicesFromStorage: Record<CategoryKey, Choice[]> = JSON.parse(
    choicesFromStorageJson
  );
  initialChoices = choicesFromStorage;
}

function App() {
  const dataByKey = useLoaderData() as DataByKey;

  // TODO: implement multiple users (store each user in local storage, use state to set user)
  const [trueMage, setTrueMage] = useState<TrueMage>(DEFAULT_TRUE_MAGE);
  const [categoryChoices, setAllChoicesByCategory] =
    useState<Record<CategoryKey, Choice[]>>(initialChoices);

  const [showValidationError, setShowValidationError] =
    useState<ValidationState>({
      show: false,
    });

  const validateNewChoices = useCallback(
    (newChoices: Choice[], categoryKey: CategoryKey) => {
      const category = dataByKey.categoriesByKey[categoryKey];
      const pointTypeKey = category.pointType;
      if (!pointTypeKey) return true;
      const pointType = dataByKey.pointTypesByKey[pointTypeKey];

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

      const usedPoints = calculatePoints(
        newChoices,
        dataByKey.entitiesByKey,
        dataByKey.entityLevelsByKey,
        pointType.key
      );

      if (usedPoints > pointType.maxPoints) {
        const oldPoints = calculatePoints(
          categoryChoices[categoryKey] || [],
          dataByKey.entitiesByKey,
          dataByKey.entityLevelsByKey,
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
      }
      return true;
    },
    [dataByKey, categoryChoices]
  );

  const setChoices = useCallback(
    (newChoices: Choice[], categoryKey: CategoryKey) => {
      const canMakeChoice = validateNewChoices(newChoices, categoryKey);
      if (!canMakeChoice) {
        return;
      }

      let newCategoryChoices = { ...categoryChoices };
      newCategoryChoices[categoryKey] = newChoices;

      localStorage.setItem(trueMage.name, JSON.stringify(newCategoryChoices));
      setAllChoicesByCategory(newCategoryChoices);
    },
    [
      dataByKey,
      categoryChoices,
      setAllChoicesByCategory,
      setShowValidationError,
    ]
  );

  return (
    <TrueMageContext.Provider value={{ trueMage, setTrueMage }}>
      <DataContext.Provider value={dataByKey}>
        <CategoryChoicesContext.Provider
          value={{ setChoices, categoryChoices }}
        >
          <div style={{ position: 'relative' }}>
            <Navbar />
            <Row style={{ padding: '20px' }}>
              <Col>
                <Outlet />
              </Col>
              <Col xs={4} style={{ maxWidth: '350px' }}>
                <Summary categoryChoices={categoryChoices} />
              </Col>
            </Row>
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
