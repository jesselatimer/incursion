import { useContext } from 'react';
import { DataContext } from './App';
import '../css/Static.css';
import Markdown from './Markdown';

export default function Home() {
  const { home } = useContext(DataContext);
  return <Markdown className="home">{home}</Markdown>;
}
