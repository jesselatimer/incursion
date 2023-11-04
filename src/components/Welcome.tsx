import { Link } from 'react-router-dom';

function Welcome() {
  return (
    <div>
      <h2>Welcome to Incursion</h2>
      <p>
        Incursion is an interactive CYOA that has you choosing from a selection
        of magical powers from pools of points. To get started, read as much of
        the <Link to={'/setting'}>Setting</Link> page as you want to get a
        handle on the world, and then jump into{' '}
        <Link to="/category/foundations">Foundations</Link> to start building
        your character.
      </p>
      <p>
        Once finished, you can export your character (TODO) and share your
        choices in a forum such as{' '}
        <a href="https://www.reddit.com/r/makeyourchoice" target="_blank">
          Reddit
        </a>
        .
      </p>
      <p>
        Note that Incursion is <em>very beefy</em> as CYOAs go. There is no
        expectation that you read every word, and we've done our best to make it
        easy to parse despite the amount of content.
      </p>
      <h3>What is a CYOA?</h3>
      <p>
        CYOA stands for "Choose Your Own Adventure". Think of it as the
        character builder from a tabletop RPG. You build out a character,
        usually some alternate version of yourself that exists in this world,
        with special attention to making choices that work well together.
      </p>
      <p>No relationship to the "Choose Your Own Adventure" series of books.</p>
    </div>
  );
}

export default Welcome;
