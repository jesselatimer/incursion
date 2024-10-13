import { useContext, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Navbar as ReactNavbar,
  Nav,
  Image,
  NavDropdown,
  DropdownItem,
  Spinner,
} from 'react-bootstrap';
import { DataContext } from './App';
import { size } from 'lodash';
import TrueMageModal from './TrueMageModal';
import { NavLink } from 'react-router-dom';

export default function Navbar() {
  const { categoriesByKey } = useContext(DataContext);
  const [showTrueMageModal, setShowTrueMageModal] = useState(false);

  const location = useLocation();

  return (
    <>
      <ReactNavbar
        expand="md"
        className="bg-body-tertiary"
        style={{ padding: '10px 20px' }}
      >
        <Link to={'/'} className="navbar-brand">
          <Image src="/incursion/incursion_logo.png" height="40px" />
        </Link>
        {size(categoriesByKey) > 1 ? (
          <ReactNavbar.Collapse id="basic-ReactNavbar-nav">
            <Nav
              className="me-auto"
              variant="underline"
              activeKey={location.pathname}
              style={{
                alignItems: 'baseline',
                justifyItems: 'center',
              }}
            >
              <NavLink to="/setting" event-key="/setting" className="nav-link">
                System & Setting
              </NavLink>
              <NavLink
                to="/build"
                event-key="/build"
                // className="nav-link"
                {...(location.pathname.startsWith('/category')
                  ? { className: 'nav-link active' }
                  : { className: 'nav-link' })}
              >
                Build
              </NavLink>
              <NavLink
                to="/character"
                event-key="/character"
                className="nav-link"
              >
                Character Summary
              </NavLink>
              <NavDropdown title="Extra">
                <DropdownItem href="#">
                  <NavLink
                    to="/glossary"
                    event-key="/glossary"
                    className="nav-link"
                  >
                    Glossary
                  </NavLink>
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
    </>
  );
}
