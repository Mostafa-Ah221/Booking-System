import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import store from './redux/store.js'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // ✅

const queryClient = new QueryClient(); // ✅

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>  {/* ✅ أضفناها هنا */}
        <App />
      </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
