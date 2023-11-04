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
  console.log('entityListLoader', params);
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
          path: pathNames.categoryKey,
          element: <EntityList />,
          loader: entityListLoader,
        },
        {
          path: '/setting',
          element: <Setting />,
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
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
