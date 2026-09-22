import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { BrowserRouter } from 'react-router-dom';
import App from './app/App';
import { queryClient } from './app/queryClient';
import { appTheme } from './app/theme';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ConfigProvider theme={appTheme}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </ConfigProvider>
  </React.StrictMode>,
);
