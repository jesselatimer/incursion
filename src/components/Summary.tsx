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

  const { trueMage } = useContext(TrueMageContext);

  return (
    <>
      <h2 className="Summary-header">{trueMage.name}</h2>
      <Stack
        className="SummaryFixed"
        gap={3}
        style={{
          position: 'sticky',
          maxHeight: '100vh',
          overflow: 'scroll',
          top: '0',
          padding: '10px 0',
        }}
      >
        {map(categoriesByKey, (category) => {
          const choices = categoryChoices[category.key];
          if (!choices?.length) return null;
          return <SummaryCard category={category} choices={choices} />;
        })}
      </Stack>
    </>
  );
}

export default Summary;
