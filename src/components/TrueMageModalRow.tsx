import {
  Button,
  Col,
  Form,
  FormCheck,
  FormControl,
  FormText,
  Image,
  OverlayTrigger,
  Row,
  Stack,
  Tooltip,
} from 'react-bootstrap';
import { useContext, useState } from 'react';
import { DataContext, TrueMageContext } from './App';
import {
  getTrueMagesFromStorage,
  initialChoices,
  getChoicesFromLocalStorage,
  updateTrueMage,
  deleteTrueMage,
} from '../data';
import { flatten, invert, map, update } from 'lodash';
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

  const [isEditingName, setIsEditingName] = useState(false);

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
      <Col xs="3">
        {isEditingName ? (
          <Form
            onSubmit={(event) => {
              event.preventDefault();

              const target = event.target as typeof event.target & {
                name: { value: string };
              };
              const name = target.name.value;

              updateTrueMage({
                ...trueMage,
                name,
              });
              setTrueMages(getTrueMagesFromStorage().trueMages);
              setIsEditingName(false);
            }}
          >
            <Form.Control
              type="text"
              name="name"
              defaultValue={trueMage.name}
            />
            <Button
              type="submit"
              style={{
                display: 'contents',
              }}
            >
              <Image
                src="/incursion/check.png"
                style={{
                  width: '12px',
                  cursor: 'pointer',
                  filter: 'invert()',
                  marginLeft: '5px',
                }}
              />
            </Button>
            <Image
              rounded
              src="/incursion/cancel.png"
              style={{
                width: '12px',
                cursor: 'pointer',
                filter: 'invert()',
                marginLeft: '5px',
              }}
              onClick={() => setIsEditingName(false)}
            />
          </Form>
        ) : (
          <>
            {trueMage.name}
            <Image
              rounded
              src="/incursion/edit.png"
              style={{
                width: '12px',
                cursor: 'pointer',
                filter: 'invert()',
                marginLeft: '5px',
              }}
              onClick={() => setIsEditingName(true)}
            />
          </>
        )}
      </Col>
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
