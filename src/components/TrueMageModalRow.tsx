import {
  Button,
  Col,
  FormCheck,
  Image,
  OverlayTrigger,
  Row,
  Stack,
  Tooltip,
} from 'react-bootstrap';
import { useContext } from 'react';
import { DataContext, TrueMageContext } from './App';
import {
  getTrueMagesFromStorage,
  initialChoices,
  getChoicesFromLocalStorage,
  updateTrueMage,
  deleteTrueMage,
} from '../data';
import { flatten, map } from 'lodash';
import { CategoryKey } from '../models/Category';
import { Choice } from '../models/Choice';
import { TrueMage } from '../models/TrueMage';

function TrueMageModalRow({
  trueMage,
  setTrueMages,
}: {
  trueMage: TrueMage;
  setTrueMages: (trueMages: TrueMage[]) => void;
}) {
  const { entitiesByKey } = useContext(DataContext);
  const { setTrueMage } = useContext(TrueMageContext);

  const categoryChoices: Record<CategoryKey, Choice[]> =
    getChoicesFromLocalStorage(trueMage) || initialChoices;
  const flatChoices = flatten(Object.values(categoryChoices));
  return (
    <Row
      style={{
        alignItems: 'center',
      }}
    >
      <Col xs="1" style={{ textAlign: 'center' }}>
        <FormCheck
          type="radio"
          id={'checkbox-' + trueMage.id}
          disabled={trueMage.isActive}
          checked={trueMage.isActive}
          onClick={() => {
            updateTrueMage({
              ...trueMage,
              isActive: true,
            });
            setTrueMage(trueMage);
            setTrueMages(getTrueMagesFromStorage().trueMages);
          }}
        />
      </Col>
      <Col xs="1">{trueMage.id}</Col>
      <Col xs="2">{trueMage.name}</Col>
      <Col>
        <Stack direction="horizontal">
          {map(flatChoices, (choice) => {
            const entity = entitiesByKey[choice.entityKey];
            const renderTooltip = (props: Record<string, any>) => (
              <Tooltip id="button-tooltip" {...props}>
                {entity.label}
                <br />
                Level {choice.level}/{entity.entityLevels.length}
              </Tooltip>
            );

            return (
              <OverlayTrigger
                placement="top"
                delay={{ show: 50, hide: 50 }}
                overlay={renderTooltip}
              >
                <Image
                  src={entity.imageUrl}
                  rounded
                  style={{
                    width: '30px',
                    height: '30px',
                    margin: '5px',
                  }}
                />
              </OverlayTrigger>
            );
          })}
        </Stack>
      </Col>
      <Col xs="1" style={{ textAlign: 'center' }}>
        {!trueMage.isActive && (
          <Button
            variant="outline-danger"
            style={{
              borderRadius: '50%',
              width: '31px',
              height: '31px',
            }}
            size="sm"
            aria-label="Delete"
            onClick={() => {
              const updatedTrueMages = deleteTrueMage(trueMage);
              setTrueMages(updatedTrueMages);
            }}
          >
            X
          </Button>
        )}
      </Col>
    </Row>
  );
}

export default TrueMageModalRow;
