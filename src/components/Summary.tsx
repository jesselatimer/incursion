import '../css/Summary.css';
import { TrueMage } from '../models/TrueMage';
import { values } from 'lodash';

function Summary({ trueMage }: { trueMage: TrueMage }) {
  return (
    <div className="Summary">
      <header className="Summary-header">{trueMage.name}</header>
      {values(trueMage.choices).map((choiceList) => {
        return choiceList.map((choice) => {
          return (
            <div>
              <strong>
                {choice.entityKey}: {choice.value}
              </strong>
            </div>
          );
        });
      })}
    </div>
  );
}

export default Summary;
