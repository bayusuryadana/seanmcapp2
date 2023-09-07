import React from 'react'
import ReactDOM from 'react-dom/client'
import { Home } from './Home.tsx'
import './index.css'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom"
import { Mamen } from './Mamen.tsx'
import { Wallet } from './wallet/Wallet.tsx'
import { WalletLogin } from './wallet/WalletLogin.tsx'
import { createContext } from 'react'

export const UserContext = createContext(null);

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
    path: "/wallet/login",
    element: <WalletLogin />
  },
  {
    path: "/wallet",
    element: <Wallet />
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
