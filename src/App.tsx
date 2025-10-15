import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <>
      <ToastProvider>
        <RouterProvider router={router}></RouterProvider>
      </ToastProvider>
    </>
  )
}

export default App
