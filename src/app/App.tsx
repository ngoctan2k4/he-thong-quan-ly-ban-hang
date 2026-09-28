import { App as AntdApp } from 'antd';
import { CommerceProvider } from '../features/commerce/CommerceContext';
import { AiAssistantWidget } from '../components/common/AiAssistantWidget';
import { AppRouter } from './router';

export default function App() {
  return (
    <AntdApp>
      <CommerceProvider>
        <AppRouter />
        <AiAssistantWidget />
      </CommerceProvider>
    </AntdApp>
  );
}
