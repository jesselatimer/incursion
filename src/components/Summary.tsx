import { useContext } from 'react';
import { values } from 'lodash';
import { TrueMageContext } from './App';
import Container from 'react-bootstrap/Container';

function Summary() {
  const { trueMage } = useContext(TrueMageContext);

  return (
    <Container className="Summary">
      <h2 className="Summary-header">{trueMage.name}</h2>
      {/* {values(trueMage.choices).map((choiceList) => {
        return choiceList.map((choice) => {
          return (
            <Container>
              <strong>
                {choice.entityKey}: {choice.value}
              </strong>
            </Container>
          );
        });
      })} */}
    </Container>
  );
}

export default Summary;
