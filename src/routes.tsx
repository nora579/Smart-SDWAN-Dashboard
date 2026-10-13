import { createBrowserRouter } from 'react-router'
import { Root } from './layouts/Root'
import { Dashboard } from './pages/Dashboard'

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Root,
    children: [
      { index: true, Component: Dashboard },
    ],
  },
])
