import { Container } from 'react-bootstrap';
import '../css/Static.css';
import { CYOA_TERMS, IN_WORLD_TERMS } from '../data/glossary';

export default function Glossary() {
  return (
    <Container fluid>
      <h1>Glossary</h1>
      <h2>In-World Terms</h2>
      {Object.entries(IN_WORLD_TERMS).map(([key, value]) => {
        return (
          <p>
            <strong>{key}</strong>: {value}
          </p>
        );
      })}
      <h2>CYOA Terms</h2>
      {Object.entries(CYOA_TERMS).map(([key, value]) => {
        return (
          <p>
            <strong>{key}</strong>: {value}
          </p>
        );
      })}
    </Container>
  );
}
