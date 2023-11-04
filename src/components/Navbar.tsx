import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Navbar as ReactNavbar, Container, Nav } from 'react-bootstrap';
import { DataContext } from './App';
import { map } from 'lodash';

export default function Navbar() {
  const { categoriesByKey } = useContext(DataContext);

  return (
    <ReactNavbar
      expand="md"
      className="bg-body-tertiary"
      style={{ padding: '20px 30px' }}
    >
      <Link to={'/'} className="navbar-brand">
        Incursion
      </Link>
      <ReactNavbar.Toggle aria-controls="basic-ReactNavbar-nav" />
      <ReactNavbar.Collapse id="basic-ReactNavbar-nav">
        <Nav className="me-auto">
          <Link to={'/setting'} className="nav-link">
            Setting
          </Link>
          {map(categoriesByKey, (category) => {
            return (
              <Link to={`/category/${category.key}`} className="nav-link">
                {category.label}
              </Link>
            );
          })}
        </Nav>
      </ReactNavbar.Collapse>
    </ReactNavbar>
  );
}
