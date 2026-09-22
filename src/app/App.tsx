import { App as AntdApp } from 'antd';
import { CommerceProvider } from '../features/commerce/CommerceContext';
import { AppRouter } from './router';

export default function App() {
  return (
    <AntdApp>
      <CommerceProvider>
        <AppRouter />
      </CommerceProvider>
    </AntdApp>
  );
}
