import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Navbar as ReactNavbar,
  Nav,
  Image,
  NavDropdown,
  DropdownItem,
  Spinner,
} from 'react-bootstrap';
import { DataContext } from './App';
import { map, size } from 'lodash';
import TrueMageModal from './TrueMageModal';

export default function Navbar() {
  const { categoriesByKey } = useContext(DataContext);
  const [showTrueMageModal, setShowTrueMageModal] = useState(false);

  return (
    <ReactNavbar
      expand="md"
      className="bg-body-tertiary"
      style={{ padding: '20px 30px' }}
    >
      <Link to={'/'} className="navbar-brand">
        Incursion
      </Link>
      {size(categoriesByKey) > 1 ? (
        <ReactNavbar.Collapse id="basic-ReactNavbar-nav">
          <Nav className="me-auto">
            <Link to="/setting" className="nav-link">
              System & Setting
            </Link>
            {map(categoriesByKey, (category) => {
              return (
                <Link
                  key={`navLink${category.key}`}
                  to={`/category/${category.key}`}
                  className="nav-link"
                >
                  {category.label}
                </Link>
              );
            })}
            <Link to="/character" className="nav-link">
              Character Summary
            </Link>
            <NavDropdown title="Extra">
              <DropdownItem href="#">
                <Link to="/glossary" className="nav-link">
                  Glossary
                </Link>
              </DropdownItem>
            </NavDropdown>
          </Nav>
        </ReactNavbar.Collapse>
      ) : (
        <Spinner
          animation="border"
          variant="secondary"
          style={{
            width: '20px',
            height: '20px',
          }}
        />
      )}
      {/* If categoriesByKey is undefined, we haven't loaded in data yet */}
      {size(categoriesByKey) > 1 && (
        <Image
          className="justify-content-end"
          src="/incursion/user-avatar.png"
          onClick={() => setShowTrueMageModal(true)}
          style={{
            cursor: 'pointer',
            height: '25px',
            filter: 'invert()',
          }}
        />
      )}
      <ReactNavbar.Toggle aria-controls="basic-ReactNavbar-nav" />
      <TrueMageModal
        setShowModal={setShowTrueMageModal}
        showModal={showTrueMageModal}
      />
    </ReactNavbar>
  );
}
