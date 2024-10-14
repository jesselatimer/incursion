import { filter, groupBy, map, size } from 'lodash';
import EntityPreview from './EntityPreview';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useContext, useMemo } from 'react';
import { CategoryChoicesContext, DataContext } from './App';
import Markdown from './Markdown';
import { Link, NavLink, useLoaderData, useLocation } from 'react-router-dom';
import { EntityListArgs } from '..';
import { Nav, Navbar, Spinner, Stack } from 'react-bootstrap';
import Summary from './Summary';

function EntityList() {
  const {
    subCategoriesByKey,
    categoriesByKey,
    entitiesByKey,
    appendicesByKey,
  } = useContext(DataContext);
  const location = useLocation();
  const { categoryChoices } = useContext(CategoryChoicesContext);
  const { categoryKey } = useLoaderData() as EntityListArgs['params'];

  const entities = useMemo(
    () => filter(entitiesByKey, (entity) => entity.category === categoryKey),
    [entitiesByKey, categoryKey]
  );

  if (!entities?.length) return null;
  if (!categoryKey) return null;

  const choices = categoryChoices[categoryKey] || [];
  const category = categoriesByKey[categoryKey];
  const entitiesBySubCategory = groupBy(entities, 'subCategory');
  const subCategories = category.subCategories.map(
    (subCategoryKey) => subCategoriesByKey[subCategoryKey]
  );
  const appendices = category.appendices?.length
    ? category.appendices.map((appendixKey) => appendicesByKey[appendixKey])
    : undefined;

  return (
    <Row className="EntityList">
      <Col>
        <Navbar expand={true} style={{ padding: '0' }}>
          <Navbar.Collapse id="basic-ReactNavbar-nav">
            <Nav
              justify
              className="me-auto"
              variant="tabs"
              activeKey={location.pathname}
              style={{
                alignItems: 'baseline',
                justifyContent: 'space-evenly',
                justifyItems: 'center',
                width: '100%',
                margin: '0 auto',
                borderBottom: 'none',
                gap: '10px',
              }}
            >
              {map(categoriesByKey, (category) => {
                return (
                  <NavLink
                    key={`navLink${category.key}`}
                    to={`/category/${category.key}`}
                    event-key={`/category/${category.key}`}
                    className={
                      location.pathname === `/category/${category.key}`
                        ? 'nav-link bg-body-color'
                        : 'nav-link bg-body-tertiary'
                    }
                    style={
                      location.pathname === `/category/${category.key}`
                        ? {
                            margin: '-1px 0',
                          }
                        : {
                            margin: '-1px 0',
                            borderBottomColor: 'rgb(73, 80, 87)',
                          }
                    }
                  >
                    {category.label}
                  </NavLink>
                );
              })}
            </Nav>
          </Navbar.Collapse>
          <Navbar.Toggle aria-controls="basic-ReactNavbar-nav" />
        </Navbar>
        <Container
          fluid
          style={{
            border: '1px solid rgb(73, 80, 87)',
            paddingTop: '15px',
            borderRadius: '0 0 6px 6px',
          }}
        >
          <Stack direction="horizontal">
            <h2>{category.label}</h2>
            <Nav>
              {map(subCategories, (subCategory) => {
                const currentEntities = entitiesBySubCategory[subCategory.key];
                const currentNonGrantedEntities = currentEntities.filter(
                  (e) => !e.grantedBy
                );
                if (!currentNonGrantedEntities?.length) return null;

                return (
                  <Link
                    key={`navLink${subCategory.key}`}
                    to={`/category/${category.key}#${subCategory.key}`}
                    className="nav-link"
                  >
                    {subCategory.label}
                  </Link>
                );
              })}
            </Nav>
          </Stack>
          {Boolean(category.description) && (
            <Markdown key={category.key}>
              {category.compiledDescription}
            </Markdown>
          )}
          {/* Mapping over all subcategories to preserve order */}
          {map(subCategories, (subCategory) => {
            const currentEntities = entitiesBySubCategory[subCategory.key];
            const currentNonGrantedEntities = currentEntities.filter(
              (e) => !e.grantedBy
            );
            if (!currentNonGrantedEntities?.length) return null;
            const currentEntitiesByKey = groupBy(currentEntities, 'key');
            return (
              <div key={subCategory.key + 'EntityList'}>
                <h3>{subCategory.label}</h3>
                {Boolean(subCategory.description) && (
                  <Markdown key={subCategory.key}>
                    {subCategory.compiledDescription}
                  </Markdown>
                )}
                <Row
                  key={subCategory.label + 'EntityListRow'}
                  id={subCategory.key}
                  xs={1}
                  sm={2}
                  md={2}
                  lg={3}
                >
                  {/* Mapping over all entities to preserve order */}
                  {map(entitiesByKey, (_, entityKey) => {
                    const entity = (currentEntitiesByKey[entityKey] || [])[0];
                    if (!entity) return null;
                    if (entity.grantedBy) return null; // Granted by cannot be chosen
                    return (
                      <Col
                        key={entity.key + 'EntityListCol'}
                        // style={{ maxWidth: '400px', minWidth: '300px' }}
                      >
                        <EntityPreview
                          key={entity.key}
                          entity={entity}
                          choices={choices}
                        />
                      </Col>
                    );
                  })}
                </Row>
              </div>
            );
          })}
          {appendices?.length
            ? map(appendices, (appendix) => {
                return (
                  <Markdown key={appendix.key + 'EntityList'}>
                    {appendix.compiledDescription}
                  </Markdown>
                );
              })
            : undefined}
        </Container>
      </Col>
      <Col xs={12} md={4} lg={4} className="SummaryWrapper">
        <Summary categoryChoices={categoryChoices} />
      </Col>
    </Row>
  );
}

export default EntityList;
