import { Button, Card } from 'react-bootstrap';
import { useContext, useMemo } from 'react';
import { CategoryChoicesContext, DataContext, TrueMageContext } from './App';
import { flatten, forEach, groupBy, map } from 'lodash';
import Markdown from 'react-markdown';
import { TrueMage } from '../models/TrueMage';
import { Category } from '../models/Category';
import { Entity } from '../models/Entity';
import { Choice } from '../models/Choice';
import { copyTextToClipboard } from '../utils/clipboard';

const createMarkdownToCopy = ({
  trueMage,
  categoriesByKey,
  categoryChoices,
  entitiesBySubCategory,
  allChoiceKeys,
}: {
  trueMage: TrueMage;
  categoriesByKey: Record<string, Category>;
  categoryChoices: Record<string, Choice[]>;
  entitiesBySubCategory: Record<string, Entity[]>;
  allChoiceKeys: Set<string>;
}) => {
  let markdown = `
**${trueMage.name}**  
`;
  forEach(categoriesByKey, (category) => {
    const choices = categoryChoices[category.key];
    if (!choices?.length) return;

    markdown += `
**${category.label}**    
`;

    forEach(category.subCategories, (subCategoryKey) => {
      const entitiesForSubcategory = entitiesBySubCategory[subCategoryKey];
      forEach(entitiesForSubcategory, (entity) => {
        if (!allChoiceKeys.has(entity.key)) return;
        const choice = choices.find(
          (choice) => choice.entityKey === entity.key
        );
        if (!choice) return;

        markdown += `* ${entity.label} ${
          entity.entityLevels.length > 1
            ? ` (${choice.level}/${entity.entityLevels.length})`
            : ''
        }
`;
      });
    });
  });

  return markdown;
};

// TODO: Add text if character is invalid
function CharacterMarkdown() {
  const { trueMage } = useContext(TrueMageContext);
  const { categoriesByKey, entitiesByKey } = useContext(DataContext);
  const { categoryChoices } = useContext(CategoryChoicesContext);

  const entitiesBySubCategory = useMemo(
    () => groupBy(entitiesByKey, 'subCategory'),
    [entitiesByKey]
  );

  const allChoiceKeys = useMemo(() => {
    return new Set(
      flatten(
        map(categoryChoices, (choices) =>
          choices.map((choice) => choice.entityKey)
        )
      )
    );
  }, [categoryChoices]);

  return (
    <Card>
      <Card.Body>
        <Button
          onClick={() =>
            copyTextToClipboard(
              createMarkdownToCopy({
                trueMage,
                categoriesByKey,
                categoryChoices,
                entitiesBySubCategory,
                allChoiceKeys,
              })
            )
          }
        >
          Copy Markdown to Clipboard
        </Button>
        <hr />
        <div
          style={{
            padding: '10px',
            backgroundColor: 'rgb(33, 37, 50)',
            border: '1px gray solid',
          }}
        >
          <Markdown>
            {createMarkdownToCopy({
              trueMage,
              categoriesByKey,
              categoryChoices,
              entitiesBySubCategory,
              allChoiceKeys,
            })}
          </Markdown>
        </div>
      </Card.Body>
    </Card>
  );
}

export default CharacterMarkdown;
