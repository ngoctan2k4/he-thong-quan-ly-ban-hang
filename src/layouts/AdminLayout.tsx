import {
  BellOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Breadcrumb,
  Button,
  Drawer,
  Grid,
  Layout,
  Menu,
  Popover,
  Space,
  theme,
  Tooltip,
  Typography,
} from 'antd';
import type { MenuProps } from 'antd';
import type { CSSProperties, KeyboardEvent, PointerEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  adminMenuItems,
  adminModules,
  getAdminModuleMenuItems,
  getAdminNavigationState,
  getAdminRouteByKey,
} from '../app/adminNavigation';
import './adminLayout.css';

const { Header, Content } = Layout;

const NAVIGATION_PANEL_DEFAULT_WIDTH = 240;
const NAVIGATION_PANEL_MIN_WIDTH = 208;
const NAVIGATION_PANEL_MAX_WIDTH = 320;
const NAVIGATION_PANEL_COLLAPSE_THRESHOLD = 152;

function clampNavigationPanelWidth(width: number) {
  return Math.min(
    NAVIGATION_PANEL_MAX_WIDTH,
    Math.max(NAVIGATION_PANEL_MIN_WIDTH, width),
  );
}

function getActiveModuleKey(openKeys: string[], selectedKeys: string[]) {
  return openKeys[0] ?? selectedKeys[0] ?? adminModules[0]?.key ?? '/admin/dashboard';
}

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const screens = Grid.useBreakpoint();
  const { token } = theme.useToken();
  const navigationState = useMemo(
    () => getAdminNavigationState(location.pathname),
    [location.pathname],
  );
  const routeModuleKey = getActiveModuleKey(
    navigationState.openKeys,
    navigationState.selectedKeys,
  );
  const [panelCollapsed, setPanelCollapsed] = useState(false);
  const [panelWidth, setPanelWidth] = useState(NAVIGATION_PANEL_DEFAULT_WIDTH);
  const [isPanelResizing, setIsPanelResizing] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeModuleKey, setActiveModuleKey] = useState(routeModuleKey);
  const [openKeys, setOpenKeys] = useState<string[]>(navigationState.openKeys);
  const panelResizeStartX = useRef(0);
  const panelResizeStartWidth = useRef(NAVIGATION_PANEL_DEFAULT_WIDTH);
  const panelResizeRawWidth = useRef(NAVIGATION_PANEL_DEFAULT_WIDTH);
  const panelResizeActive = useRef(false);

  const isMobile = screens.lg === false;
  const isCompactNavigation = panelCollapsed || screens.xl === false;
  const activeModule =
    adminModules.find((module) => module.key === activeModuleKey) ?? adminModules[0];
  const activeModuleItems = getAdminModuleMenuItems(activeModuleKey);
  const panelOpenKeys = openKeys.filter((key) => key !== activeModuleKey);

  useEffect(() => {
    setActiveModuleKey(routeModuleKey);
    setOpenKeys(navigationState.openKeys);
    setMobileOpen(false);
  }, [navigationState.openKeys, routeModuleKey]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    const route = getAdminRouteByKey(String(key));
    if (route && route.path !== location.pathname) {
      navigate(route.path);
    }
    setMobileOpen(false);
  };

  const handleModuleClick = (moduleKey: string, path?: string) => {
    setActiveModuleKey(moduleKey);
    setOpenKeys((current) => [moduleKey, ...current.filter((key) => key !== moduleKey)]);

    if (path) {
      if (path !== location.pathname) {
        navigate(path);
      }
      return;
    }

    if (panelCollapsed && screens.xl !== false) {
      setPanelCollapsed(false);
    }
  };

  const handleNavigationToggle = () => {
    if (isMobile) {
      setMobileOpen(true);
      return;
    }

    setPanelCollapsed((current) => !current);
  };

  const handlePanelResizeStart = (event: PointerEvent<HTMLDivElement>) => {
    if (event.button !== 0 || isCompactNavigation) {
      return;
    }

    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    panelResizeStartX.current = event.clientX;
    panelResizeStartWidth.current = panelWidth;
    panelResizeRawWidth.current = panelWidth;
    panelResizeActive.current = true;
    setIsPanelResizing(true);
  };

  const handlePanelResizeMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!panelResizeActive.current) {
      return;
    }

    const nextWidth =
      panelResizeStartWidth.current + event.clientX - panelResizeStartX.current;
    panelResizeRawWidth.current = nextWidth;
    setPanelWidth(clampNavigationPanelWidth(nextWidth));
  };

  const finishPanelResize = (
    event: PointerEvent<HTMLDivElement>,
    allowCollapse: boolean,
  ) => {
    if (!panelResizeActive.current) {
      return;
    }

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    panelResizeActive.current = false;
    setIsPanelResizing(false);

    if (
      allowCollapse &&
      panelResizeRawWidth.current <= NAVIGATION_PANEL_COLLAPSE_THRESHOLD
    ) {
      setPanelCollapsed(true);
    }
  };

  const handlePanelResizeLost = () => {
    panelResizeActive.current = false;
    setIsPanelResizing(false);
  };

  const handlePanelResizeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 24 : 8;

    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      if (panelWidth <= NAVIGATION_PANEL_MIN_WIDTH) {
        setPanelCollapsed(true);
        return;
      }
      setPanelWidth((current) =>
        clampNavigationPanelWidth(current - step),
      );
    }

    if (event.key === 'ArrowRight') {
      event.preventDefault();
      setPanelWidth((current) =>
        clampNavigationPanelWidth(current + step),
      );
    }

    if (event.key === 'Home') {
      event.preventDefault();
      setPanelWidth(NAVIGATION_PANEL_MIN_WIDTH);
    }

    if (event.key === 'End') {
      event.preventDefault();
      setPanelWidth(NAVIGATION_PANEL_MAX_WIDTH);
    }
  };

  return (
    <Layout
      className={`admin-shell${isPanelResizing ? ' admin-shell--resizing' : ''}`}
      style={
        {
          '--admin-primary': token.colorPrimary,
          '--admin-primary-bg': token.colorPrimaryBg,
          '--admin-bg-layout': token.colorBgLayout,
          '--admin-bg-container': token.colorBgContainer,
          '--admin-fill': token.colorFillTertiary,
          '--admin-border': token.colorBorderSecondary,
          '--admin-text': token.colorText,
          '--admin-text-secondary': token.colorTextSecondary,
          '--admin-radius': `${token.borderRadius}px`,
          '--admin-control-height': `${token.controlHeight}px`,
          '--admin-navigation-width': `${panelWidth}px`,
        } as CSSProperties
      }
    >
      <aside
        className={`admin-sidebar${isCompactNavigation ? ' admin-sidebar--compact' : ''}`}
        aria-label="Điều hướng quản trị"
      >
        <div className="admin-module-rail">
          <div className="admin-module-rail__brand" aria-label="SalesHub Admin">
            SH
          </div>

          <nav className="admin-module-rail__modules" aria-label="Phân hệ quản trị">
            {adminModules.map((module) => {
              const isActive = module.key === activeModuleKey;
              const moduleButton = (
                <button
                  type="button"
                  className={`admin-module-rail__button${isActive ? ' is-active' : ''}`}
                  aria-label={module.label}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => handleModuleClick(module.key, module.path)}
                >
                  {module.icon}
                </button>
              );

              if (isCompactNavigation && !module.path) {
                return (
                  <Popover
                    key={module.key}
                    placement="rightTop"
                    trigger={['hover', 'focus']}
                    overlayClassName="admin-module-flyout"
                    mouseEnterDelay={0.25}
                    mouseLeaveDelay={0.15}
                    content={
                      <div className="admin-module-flyout__content">
                        <Typography.Text className="admin-module-flyout__title" strong>
                          {module.label}
                        </Typography.Text>
                        <Menu
                          className="admin-module-flyout__menu"
                          mode="vertical"
                          items={getAdminModuleMenuItems(module.key)}
                          selectedKeys={navigationState.selectedKeys}
                          onClick={handleMenuClick}
                        />
                      </div>
                    }
                  >
                    {moduleButton}
                  </Popover>
                );
              }

              return (
                <Tooltip
                  key={module.key}
                  placement="right"
                  title={module.label}
                  mouseEnterDelay={0.8}
                >
                  {moduleButton}
                </Tooltip>
              );
            })}
          </nav>
        </div>

        <div className="admin-navigation-panel">
          <div className="admin-navigation-panel__brand">
            <Typography.Text strong>SalesHub</Typography.Text>
            <Typography.Text type="secondary">Quản trị vận hành</Typography.Text>
          </div>
          <div className="admin-navigation-panel__module">
            <Typography.Text>{activeModule?.label}</Typography.Text>
          </div>
          <div className="admin-navigation-panel__scroll">
            <Menu
              className="admin-navigation-menu"
              mode="inline"
              selectedKeys={navigationState.selectedKeys}
              openKeys={panelOpenKeys}
              items={activeModuleItems}
              onOpenChange={(keys) =>
                setOpenKeys([activeModuleKey, ...keys.map(String)])
              }
              onClick={handleMenuClick}
            />
          </div>
        </div>
        <div
          className="admin-navigation-resizer"
          role="separator"
          tabIndex={0}
          aria-label="Thay đổi độ rộng menu. Kéo sát về bên trái để thu gọn."
          aria-orientation="vertical"
          aria-valuemin={NAVIGATION_PANEL_MIN_WIDTH}
          aria-valuemax={NAVIGATION_PANEL_MAX_WIDTH}
          aria-valuenow={panelWidth}
          title="Kéo để đổi độ rộng; kéo sát trái để thu gọn"
          onPointerDown={handlePanelResizeStart}
          onPointerMove={handlePanelResizeMove}
          onPointerUp={(event) => finishPanelResize(event, true)}
          onPointerCancel={(event) => finishPanelResize(event, false)}
          onLostPointerCapture={handlePanelResizeLost}
          onDoubleClick={() => setPanelWidth(NAVIGATION_PANEL_DEFAULT_WIDTH)}
          onKeyDown={handlePanelResizeKeyDown}
        />
      </aside>

      <Layout className="admin-main-layout">
        <Header className="admin-topbar">
          <div className="admin-topbar__left">
            <Button
              type="text"
              className="admin-topbar__toggle"
              icon={
                isMobile || isCompactNavigation ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
              }
              aria-label={isMobile ? 'Mở menu quản trị' : 'Thu gọn hoặc mở rộng menu'}
              onClick={handleNavigationToggle}
            />
            <Breadcrumb
              className="admin-topbar__breadcrumb"
              items={navigationState.breadcrumbs.map((item) => ({
                key: item.key,
                title: item.label,
              }))}
            />
          </div>

          <Space size={4} className="admin-topbar__actions">
            <Tooltip title="Tìm kiếm" mouseEnterDelay={0.8}>
              <Button type="text" icon={<SearchOutlined />} aria-label="Tìm kiếm" />
            </Tooltip>
            <Tooltip title="Thông báo" mouseEnterDelay={0.8}>
              <Badge dot offset={[-5, 6]}>
                <Button type="text" icon={<BellOutlined />} aria-label="Thông báo" />
              </Badge>
            </Tooltip>
            <span className="admin-topbar__profile">
              <Avatar size={30} icon={<UserOutlined />} />
              <Typography.Text>Admin</Typography.Text>
            </span>
          </Space>
        </Header>

        <Content className="admin-content">
          <Outlet />
        </Content>
      </Layout>

      <Drawer
        open={mobileOpen}
        placement="left"
        width="min(320px, calc(100% - 32px))"
        title="SalesHub Admin"
        className="admin-mobile-navigation"
        styles={{ body: { padding: 0 } }}
        onClose={() => setMobileOpen(false)}
      >
        <Menu
          className="admin-navigation-menu admin-navigation-menu--mobile"
          mode="inline"
          selectedKeys={navigationState.selectedKeys}
          openKeys={openKeys}
          items={adminMenuItems}
          onOpenChange={(keys) => setOpenKeys(keys.map(String))}
          onClick={handleMenuClick}
        />
      </Drawer>
    </Layout>
  );
}
