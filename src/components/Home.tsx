import { useContext } from 'react';
import '../css/Static.css';
import { Container, Image } from 'react-bootstrap';
import { DataContext } from './App';
import { Link } from 'react-router-dom';

export default function Home() {
  const dataByKey = useContext(DataContext);
  const dataLoaded = dataByKey.setting !== undefined;

  return (
    <Container fluid>
      <h1>Incursion: A Choose Your Own Adventure</h1>
      <Image
        src="/incursion/setting1.jpg"
        rounded
        style={{
          float: 'right',
          maxWidth: '40%',
          margin: '0 0 15px 15px',
        }}
      />
      <p>
        You have been bestowed the gift of thaumaturgy in a world similar but
        different to the one you know.
      </p>
      <p>
        You can read about the <strong>new world and your new power</strong>{' '}
        under{' '}
        {dataLoaded ? (
          <Link to="/setting">System & Setting</Link>
        ) : (
          'System & Setting'
        )}
        . After that are four sections, in each you have a separate pool of
        points or set of choices.
      </p>
      <p>
        In{' '}
        {dataLoaded ? (
          <Link to="/category/foundations">Foundations</Link>
        ) : (
          'Foundations'
        )}
        , spend Foundation points to increase your Thaumaturgic Power and
        Endurance and purchase the Sources and Methods you use to{' '}
        <strong>access power and cast magic</strong>.
      </p>
      <p>
        In{' '}
        {dataLoaded ? <Link to="/category/talents">Talents</Link> : 'Talents'},
        spend Talent points to{' '}
        <strong>enhance your repertoire of spells</strong> and gain passive
        benefits.
      </p>
      <p>
        In {dataLoaded ? <Link to="/category/bonds">Bonds</Link> : 'Bonds'},
        assign Bond points to gain <strong>magical Artifacts</strong>, make{' '}
        <strong>special Contacts</strong>, befriend{' '}
        <strong>powerful Allies</strong>, and forge{' '}
        <strong>supernatural Pacts</strong>.
      </p>
      <p>
        Finally, you will have the chance to choose zero to two{' '}
        {dataLoaded ? <Link to="/category/threats">Threats</Link> : 'Threats'}.
        Each one places you in the path of some{' '}
        <strong>grave risk to the world</strong>, but also grants you unique
        benefits to fight it, and rewards should you overcome.
      </p>
      <p>
        Once finished, you can{' '}
        {dataLoaded ? (
          <Link to="/character">export your character</Link>
        ) : (
          'export your character'
        )}{' '}
        and share your choices in a forum such as{' '}
        <a href="https://www.reddit.com/r/makeyourchoice" target="_blank">
          Reddit
        </a>
        .
      </p>
      <p>
        <em>
          Note: while we have a lot of respect for slim and easy to understand
          CYOAs, this is not one of them. We try not to waste your time, but it
          will be difficult to make meaningful choices without understanding how
          magic works. If you're ever confused about a term or concept, you can
          visit the{' '}
          {dataLoaded ? (
            <Link to="/setting">System & Setting</Link>
          ) : (
            'System & Setting'
          )}{' '}
          or {dataLoaded ? <Link to="/glossary">Glossary</Link> : 'Glossary'}{' '}
          pages.
        </em>
      </p>
    </Container>
  );
}
