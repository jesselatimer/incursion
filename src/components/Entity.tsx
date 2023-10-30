import { Entity as EntityModel, EntityKey } from '../models/Entity';
import ReactMarkdown from 'react-markdown';
import Card from 'react-bootstrap/Card';
import { Choice } from '../models/Choice';
import { DataContext, REQUIRED_ENTITY_KEYS, SetChoicesContext } from './App';
import {
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { forEach, keyBy, map } from 'lodash';
import { calculatePoints } from '../utils/calculatePoints';
import { EntityLevelKey } from '../models/EntityLevel';

function Entity({
  entity,
  entityKey,
  choices,
}: {
  entity: EntityModel;
  entityKey: EntityKey;
  choices: Choice[];
}) {
  const dataByKey = useContext(DataContext);
  const { categoriesByKey, pointTypesByKey, entitiesByKey, entityLevelsByKey } =
    dataByKey;

  const setChoices = useContext(SetChoicesContext);
  const {
    choice,
    category,
    pointType,
    chosenLevel,
    usesPoints,
    pointsUsed,
    pointsRemaining,
  } = useMemo(() => {
    const choice = choices.find((choice) => choice.entityKey === entityKey);
    const category = categoriesByKey[entity.category];
    const pointType = category.pointType
      ? pointTypesByKey[category.pointType]
      : null;
    const usesPoints = pointType !== null;
    const pointsUsed = calculatePoints(
      choices,
      entitiesByKey,
      entityLevelsByKey,
      pointType?.key
    );
    return {
      choice,
      category,
      pointType,
      chosenLevel: choice?.level || 0,
      usesPoints,
      pointsUsed,
      pointsRemaining: usesPoints ? pointType.maxPoints - pointsUsed : 0,
    };
  }, [choices, dataByKey]);

  const onClickSelect = useCallback(
    (level: number) => {
      setChoices(
        [
          ...choices.filter((choice) => choice.entityKey !== entityKey),
          { entityKey, level },
        ],
        category.key
      );
    },
    [setChoices, choices, choice, dataByKey]
  );

  const onClickUnselect = useCallback(() => {
    if (
      REQUIRED_ENTITY_KEYS[category.key]?.includes(entity.key) &&
      chosenLevel > 1
    ) {
      setChoices(
        [
          ...choices.filter((choice) => choice.entityKey !== entityKey),
          {
            entityKey: entity.key,
            level: 1,
          },
        ],
        category.key
      );
    } else {
      setChoices(
        choices.filter((choice) => choice.entityKey !== entityKey),
        category.key
      );
    }
  }, [setChoices, choices, choice, chosenLevel, dataByKey]);

  const [entityDescription, setEntityDescription] = useState<string | null>(
    null
  );
  const [entityLevelDescriptions, setEntityLevelDescriptions] = useState<
    Record<EntityLevelKey, string>
  >({});

  //Get markdown file
  useEffect(() => {
    const fetchMarkdown = async (
      locations: string[],
      callback: (descriptionStringsByLocation: Record<string, string>) => void
    ) => {
      const descriptionStringsByLocation: Record<string, string> = {};
      for (const location of locations) {
        console.log('MD location: ', location);
        try {
          const self = await fetch(`/incursion/imported/${location}`);
          const selfString = await self.text();
          if (selfString) {
            const regex = /\[\]\(.+\.md/g;
            const matches = selfString.match(regex);
            if (matches?.length) {
              const pathToDescription = matches[0].slice(3);
              console.log('pathToDescription', pathToDescription);
              const description = await fetch(
                `/incursion/imported/${pathToDescription}`
              );
              const descriptionString = await description.text();
              descriptionStringsByLocation[location] = descriptionString;
            }
          }
        } catch (e) {
          console.log("Markdown file: couldn't read =>", location, e);
        }
      }
      callback(descriptionStringsByLocation);
    };

    // @ts-ignore TODO: remove me
    fetchMarkdown([entity.pathToSelf], (descriptionStringsByLocation) =>
      // @ts-ignore TODO: remove me
      setEntityDescription(descriptionStringsByLocation[entity.pathToSelf])
    );

    const entityLevelsByLocation = keyBy(
      entity.entityLevels.map(
        (entityLevelKey) => entityLevelsByKey[entityLevelKey]
      ),
      'pathToSelf'
    );
    fetchMarkdown(
      // @ts-ignore TODO: remove me
      map(entityLevelsByLocation, (el) => el.pathToSelf),
      (descriptionStringsByLocation) => {
        const descriptionStringsByEntityLevelKey: Record<
          EntityLevelKey,
          string
        > = {};
        forEach(descriptionStringsByLocation, (description, location) => {
          const entityLevel = entityLevelsByLocation[location];
          descriptionStringsByEntityLevelKey[entityLevel.key] = description;
        });
        setEntityLevelDescriptions(descriptionStringsByEntityLevelKey);
      }
    );
  }, []);

  return (
    <Card border={choice ? 'light' : 'secondary'} text={choice ? 'light' : ''}>
      <Card.Img variant="top" src={`/incursion/images/${entityKey}.jpg`} />
      <Card.Body>
        <Card.Title>{entity.label}</Card.Title>
        {Boolean(entityDescription) && (
          <Card.Text>
            <ReactMarkdown
              components={{
                h1() {
                  return null;
                },
              }}
            >
              {entityDescription}
            </ReactMarkdown>
          </Card.Text>
        )}
        <Card.Text>
          Level: {choice ? choice.level : 0}/{entity.entityLevels.length}
        </Card.Text>
        {map(entity.entityLevels, (levelKey) => {
          const entityLevel = entityLevelsByKey[levelKey];
          const pointsUsedAfterPurchasingLevel = calculatePoints(
            [
              ...choices.filter((c) => c.entityKey !== entity.key),
              { entityKey: entity.key, level: entityLevel.level },
            ],
            entitiesByKey,
            entityLevelsByKey,
            pointType!.key
          );
          const pointsUsedWithoutThisChoice = calculatePoints(
            [...choices.filter((c) => c.entityKey !== entity.key)],
            entitiesByKey,
            entityLevelsByKey,
            pointType!.key
          );
          const canBePurchased = usesPoints
            ? pointsRemaining >= pointsUsedAfterPurchasingLevel - pointsUsed
            : true;
          const pointsToShow =
            entityLevel.level === chosenLevel
              ? pointsUsed - pointsUsedWithoutThisChoice
              : pointsUsedAfterPurchasingLevel - pointsUsedWithoutThisChoice;
          const onClick =
            entityLevel.level === chosenLevel
              ? () => onClickUnselect()
              : () => onClickSelect(entityLevel.level);
          return (
            <Card
              key={entityKey + entityLevel.level + 'SummaryCard'}
              border={
                canBePurchased
                  ? entityLevel.level <= chosenLevel
                    ? 'secondary'
                    : 'secondary'
                  : entityLevel.level <= chosenLevel
                  ? 'danger'
                  : 'dark'
              }
              bg={
                canBePurchased
                  ? entityLevel.level <= chosenLevel
                    ? 'light'
                    : 'dark'
                  : entityLevel.level <= chosenLevel
                  ? 'light'
                  : 'danger'
              }
              text={
                canBePurchased
                  ? entityLevel.level <= chosenLevel
                    ? 'dark'
                    : 'light'
                  : entityLevel.level <= chosenLevel
                  ? 'danger'
                  : 'light'
              }
              onClick={onClick}
              style={{ cursor: 'pointer', marginBottom: '10px' }}
            >
              <Card.Body>
                <Card.Title>{`Level ${entityLevel.level}`}</Card.Title>
                {usesPoints && <Card.Text>{pointsToShow} points</Card.Text>}
                {Boolean(entityLevelDescriptions[entityLevel.key]) && (
                  <Card.Text>
                    <ReactMarkdown
                      components={{
                        h1() {
                          return null;
                        },
                      }}
                    >
                      {entityLevelDescriptions[entityLevel.key]}
                    </ReactMarkdown>
                  </Card.Text>
                )}
              </Card.Body>
            </Card>
          );
        })}
      </Card.Body>
    </Card>
  );
}

export default Entity;
