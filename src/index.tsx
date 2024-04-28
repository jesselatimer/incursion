import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {
  createBrowserRouter,
  LoaderFunction,
  LoaderFunctionArgs,
  ParamParseKey,
  Params,
  RouterProvider,
} from 'react-router-dom';
import EntityList from './components/EntityList';
import { getDataFromImport } from './utils/importData';
import Setting from './components/Setting';
import Home from './components/Home';
import CharacterPage from './components/CharacterPage';
import { Spinner } from 'react-bootstrap';

async function loader() {
  return await getDataFromImport();
}

const pathNames = { categoryKey: '/category/:categoryKey' } as const;
export interface EntityListArgs extends LoaderFunctionArgs {
  params: Params<ParamParseKey<typeof pathNames.categoryKey>>;
}

export const entityListLoader: LoaderFunction = ({
  params,
}: EntityListArgs) => {
  return params || {};
};

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <App />,
      // errorElement: <ErrorPage />,
      loader,
      children: [
        {
          path: '/',
          element: <Home />,
        },
        {
          path: pathNames.categoryKey,
          element: <EntityList />,
          loader: entityListLoader,
        },
        {
          path: '/setting',
          element: <Setting />,
        },
        {
          path: '/character',
          element: <CharacterPage />,
        },
      ],
    },
  ],
  {
    basename: `/incursion`,
  }
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Spinner
      animation="border"
      variant="primary"
      style={{
        position: 'absolute',
        left: 'calc(50% - 50px)',
        top: '30%',
        width: '100px',
        height: '100px',
      }}
    />
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
