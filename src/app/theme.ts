import type { ThemeConfig } from 'antd';

export const appTheme: ThemeConfig = {
  token: {
    colorPrimary: '#0A2463',
    colorSuccess: '#16A34A',
    colorWarning: '#F59E0B',
    colorError: '#DC2626',
    colorBgLayout: '#F0F4FA',
    colorBgContainer: '#FFFFFF',
    colorBorder: '#DDE3EE',
    borderRadius: 10,
    fontFamily: '"Be Vietnam Pro", Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  components: {
    Button: {
      colorPrimary: '#0A2463',
      algorithm: true,
    },
  },
};
