import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import Home from './Home.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import Mamen from './Mamen.tsx'
import Wallet from './Wallet.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />
  },
  {
    path: "/mamen",
    element: <Mamen />
  },
  {
    path: "/wallet",
    element: <Wallet />
  },
  
  {
    path: "/app",
    element: <App />,
  },
  // {
  //   path: "/memek",
  //   element: <App />
  // }
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
