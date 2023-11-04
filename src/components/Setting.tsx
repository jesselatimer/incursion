import { useContext } from 'react';
import { DataContext } from './App';
import Markdown from 'react-markdown';

export default function Setting() {
  const { setting } = useContext(DataContext);
  return <Markdown>{setting}</Markdown>;
}
