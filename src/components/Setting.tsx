import { useContext } from 'react';
import { DataContext } from './App';
import '../css/Static.css';
import Markdown from './Markdown';

export default function Setting() {
  const { setting } = useContext(DataContext);
  return <Markdown className="setting">{setting}</Markdown>;
}
