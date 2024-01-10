import { useContext, useState } from 'react';
import { DataContext, TrueMageContext } from './App';
import { Choice } from '../models/Choice';
import { CategoryKey } from '../models/Category';
import { map } from 'lodash';
import { Button, Stack } from 'react-bootstrap';
import SummaryCard from './SummaryCard';
import TrueMageModal from './TrueMageModal';

function Summary({
  categoryChoices,
}: {
  categoryChoices: Record<CategoryKey, Choice[]>;
}) {
  const dataByKey = useContext(DataContext);
  const { categoriesByKey } = dataByKey;

  const { trueMage } = useContext(TrueMageContext);
  const [showTrueMageModal, setShowTrueMageModal] = useState(false);

  return (
    <>
      <h2 className="Summary-header">
        {trueMage.name}{' '}
        <span
          style={{
            fontSize: '12px',
          }}
        >
          (
          <Button
            variant="link"
            onClick={() => setShowTrueMageModal(true)}
            style={{
              padding: '0',
            }}
          >
            edit
          </Button>
          )
        </span>
      </h2>
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
          return (
            <SummaryCard
              key={category.key + 'SummaryCard'}
              category={category}
              choices={choices}
            />
          );
        })}
      </Stack>
      <TrueMageModal
        setShowModal={setShowTrueMageModal}
        showModal={showTrueMageModal}
      />
    </>
  );
}

export default Summary;
