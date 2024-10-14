import { useContext } from 'react';
import { DataContext, TrueMageContext } from './App';
import { Choice } from '../models/Choice';
import { CategoryKey } from '../models/Category';
import { map } from 'lodash';
import { Stack } from 'react-bootstrap';
import SummaryCard from './SummaryCard';

function Summary({
  categoryChoices,
}: {
  categoryChoices: Record<CategoryKey, Choice[]>;
}) {
  const dataByKey = useContext(DataContext);
  const { categoriesByKey } = dataByKey;

  return (
    <Stack
      className="SummaryFixed"
      gap={3}
      style={{
        position: 'sticky',
        maxHeight: '100vh',
        overflow: 'scroll',
        top: '10px',
      }}
    >
      {map(categoriesByKey, (category) => {
        const choices = categoryChoices[category.key];
        return (
          <SummaryCard
            key={category.key + 'SummaryCard'}
            category={category}
            choices={choices}
          />
        );
      })}
    </Stack>
  );
}

export default Summary;
