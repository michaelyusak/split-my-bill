import './App.css'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import { useState } from 'react';
import Toast from './components/Toast';
import { ToastContextV2 } from './contexts/ToastDataV2';
import type { ToastDataV2 } from './interfaces/ToastDataV2';

function App() {
  const [toasts, setToasts] = useState<ToastDataV2[]>([]);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <>
      <ToastContextV2.Provider value={{ toasts, setToasts }}>
        <RouterProvider router={router}></RouterProvider>
        {/* Toast Container */}
        <div className="w-[80%] md:w-[70%] xl:w-[60%] fixed top-[50px] left-1/2 -translate-x-1/2 flex flex-col gap-3 z-[1000]">
          {toasts.map((toast) => (
            <Toast
              key={toast.id}
              message={toast.message}
              isSuccess={toast.isSuccess ?? false}
              withLoginButton={toast.withLoginRedirection}
              onClose={() => removeToast(toast.id)}
            />
          ))}
        </div>
      </ToastContextV2.Provider>
    </>
  )
}

export default App
