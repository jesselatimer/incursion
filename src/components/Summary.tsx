import { useContext } from 'react';
import '../css/Summary.css';
import { values } from 'lodash';
import { TrueMageContext } from './App';

function Summary() {
  const { trueMage } = useContext(TrueMageContext);

  return (
    <div className="Summary">
      <header className="Summary-header">{trueMage.name}</header>
      {/* {values(trueMage.choices).map((choiceList) => {
        return choiceList.map((choice) => {
          return (
            <div>
              <strong>
                {choice.entityKey}: {choice.value}
              </strong>
            </div>
          );
        });
      })} */}
    </div>
  );
}

export default Summary;
