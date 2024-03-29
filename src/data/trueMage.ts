import { TrueMage } from '../models/TrueMage';

export const DEFAULT_TRUE_MAGE: TrueMage = {
  name: 'True Mage',
  id: 1,
  isActive: true,
};

export const getTrueMagesFromStorage = () => {
  const savedTrueMagesJson = localStorage.getItem('trueMages');
  if (!savedTrueMagesJson) {
    localStorage.setItem('trueMages', JSON.stringify([DEFAULT_TRUE_MAGE]));
  }
  const trueMages: TrueMage[] = savedTrueMagesJson
    ? JSON.parse(savedTrueMagesJson)
    : [DEFAULT_TRUE_MAGE];
  const currentTrueMage =
    trueMages.find((trueMage) => trueMage.isActive) || DEFAULT_TRUE_MAGE;

  return { currentTrueMage, trueMages };
};

export const updateTrueMage = (trueMage: TrueMage) => {
  const { trueMages, currentTrueMage } = getTrueMagesFromStorage();

  let trueMageFromStorage = trueMages.find((tm) => trueMage.id === tm.id);
  if (!trueMageFromStorage) {
    trueMageFromStorage = { ...trueMage };
    trueMages.push(trueMageFromStorage);
  }

  if (trueMage.isActive && trueMage.id !== currentTrueMage.id) {
    currentTrueMage.isActive = false;
    trueMageFromStorage.isActive = true;
  }

  if (trueMage.name !== trueMageFromStorage.name) {
    trueMageFromStorage.name = trueMage.name;
  }

  localStorage.setItem('trueMages', JSON.stringify(trueMages));
};

export const createNewTrueMage = () => {
  const { trueMages } = getTrueMagesFromStorage();
  let highestId = 0;
  trueMages.forEach((trueMage) => {
    if (trueMage.id > highestId) highestId = trueMage.id;
  });

  const newTrueMage = {
    ...DEFAULT_TRUE_MAGE,
    id: highestId + 1,
  };

  updateTrueMage(newTrueMage);
  return newTrueMage;
};

export const deleteTrueMage = (trueMage: TrueMage) => {
  const { trueMages } = getTrueMagesFromStorage();
  if (trueMage.isActive) return trueMages;

  let filteredTrueMages = trueMages.filter((tm) => tm.id !== trueMage.id);
  localStorage.setItem('trueMages', JSON.stringify(filteredTrueMages));
  return filteredTrueMages;
};
