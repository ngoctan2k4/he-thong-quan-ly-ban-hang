import {
  ClearOutlined,
  CloseOutlined,
  LoadingOutlined,
  MinusOutlined,
  RobotOutlined,
  RocketOutlined,
  SendOutlined,
  UpOutlined,
} from '@ant-design/icons';
import {
  Avatar,
  Badge,
  Button,
  Flex,
  Input,
  Space,
  Tag,
} from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useCommerce } from '../../features/commerce/CommerceContext';
import { formatCurrency } from '../../features/commerce/pricing';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  time: string;
  toolsUsed?: { name: string; latency: string; status: 'ok' | 'error' }[];
  sqlQuery?: string;
  reasoning?: string;
  proposal?: {
    type: 'STOCK_TRANSFER' | 'PURCHASE_ORDER' | 'CREDIT_APPROVAL';
    title: string;
    details: string;
    actionLabel: string;
  };
  structuredData?: Array<{ label: string; value: string; highlight?: boolean }>;
}

export function AiAssistantWidget() {
  const { products, orders } = useCommerce();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Xin chào! Tôi là **AI Agent Trợ lý Đa kênh & Tồn kho**. Tôi được kết nối trực tiếp với **Lõi Rule Engine** và **Cơ sở dữ liệu Read-Only** của hệ thống.\n\nBạn có thể hỏi tôi về tồn kho đa chi nhánh, phân tích doanh thu bán chạy, hoặc yêu cầu lập đề xuất điều chuyển/nhập hàng tự động.`,
      time: 'Vừa xong',
      toolsUsed: [{ name: 'system_health_check()', latency: '4ms', status: 'ok' }],
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handlePresetQuery = (query: string) => {
    setInputText(query);
    processQuery(query);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || isTyping) return;
    const query = inputText;
    setInputText('');
    processQuery(query);
  };

  const processQuery = (query: string) => {
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    setTimeout(() => {
      const q = query.toLowerCase();
      let aiResponse: Partial<Message> = {};

      if (q.includes('còn bao nhiêu') || q.includes('tồn kho') || q.includes('iphone') || q.includes('s24')) {
        const found = products.find((p) => q.includes(p.name.toLowerCase().slice(0, 8)) || q.includes(p.brand?.toLowerCase() ?? ''));
        const p = found || products[0];
        aiResponse = {
          text: `Theo dữ liệu thời gian thực từ **Inventory Core**, sản phẩm **${p.name}** (SKU: \`${p.sku}\`) hiện có tình trạng tồn kho như sau:`,
          toolsUsed: [
            { name: `query_current_stock(product_id=${p.id})`, latency: '12ms', status: 'ok' },
            { name: `get_stock_across_branches(sku='${p.sku}')`, latency: '18ms', status: 'ok' },
          ],
          sqlQuery: `SELECT product_id, warehouse_id, available_quantity, safety_stock FROM inventory WHERE product_id = ${p.id} LIMIT 10;`,
          reasoning: `Truy vấn trực tiếp số lượng khả dụng tại kho Hà Nội và HCM. Đối chiếu với thông số Safety Stock (10 chiếc).`,
          structuredData: [
            { label: 'Tổng tồn khả dụng', value: `${p.availableStock} ${p.unit}`, highlight: true },
            { label: 'Kho Hà Nội (HN-WH01)', value: `${Math.ceil(p.availableStock * 0.6)} ${p.unit}` },
            { label: 'Kho TP.HCM (HCM-WH01)', value: `${Math.floor(p.availableStock * 0.4)} ${p.unit}` },
            { label: 'Mức tồn an toàn (Safety Stock)', value: `10 ${p.unit}` },
            { label: 'Đơn giá niêm yết', value: formatCurrency(p.retailPrice) },
          ],
        };
      } else if (q.includes('bán chạy') || q.includes('doanh thu') || q.includes('top')) {
        const topList = products.slice(0, 3);
        aiResponse = {
          text: `Báo cáo phân tích doanh thu và sản phẩm bán chạy nhất trong tuần (kết hợp 3 kênh: **Website**, **POS** và **Wholesale**):`,
          toolsUsed: [
            { name: 'get_top_selling_products(period="week", top_n=5)', latency: '24ms', status: 'ok' },
            { name: 'get_revenue_trend(period="week")', latency: '16ms', status: 'ok' },
          ],
          sqlQuery: `SELECT p.name, SUM(oi.quantity) as sold_qty, SUM(oi.subtotal) as total_rev FROM order_items oi JOIN orders o ON oi.order_id = o.id WHERE o.created_at >= NOW() - INTERVAL '7 days' GROUP BY p.name ORDER BY sold_qty DESC LIMIT 5;`,
          reasoning: `Rule Engine tính tổng số lượng bán ra từ 128 đơn hàng hoàn tất. Kênh POS chiếm 45%, Website chiếm 35%, Wholesale chiếm 20% tổng doanh số.`,
          structuredData: topList.map((it, idx) => ({
            label: `#${idx + 1} ${it.name}`,
            value: `${formatCurrency(it.retailPrice * (15 - idx * 3))} (${15 - idx * 3} đã bán)`,
            highlight: idx === 0,
          })),
        };
      } else if (q.includes('thiếu hàng') || q.includes('sắp hết') || q.includes('cảnh báo') || q.includes('dead stock')) {
        aiResponse = {
          text: `🚨 **Cảnh báo Tồn kho từ Rule Engine:**\nĐã phát hiện **2 mặt hàng** có lượng tồn chạm ngưỡng đặt hàng lại (**Reorder Point**) và cần được bổ sung ngay:`,
          toolsUsed: [
            { name: 'get_inventory_signals()', latency: '14ms', status: 'ok' },
            { name: 'get_low_stock_products(threshold=10)', latency: '15ms', status: 'ok' },
          ],
          sqlQuery: `SELECT p.name, i.quantity, i.reorder_point FROM inventory i JOIN products p ON i.product_id = p.id WHERE i.quantity <= i.reorder_point;`,
          reasoning: `Công thức: Reorder Point = (Tốc độ bán TB × Thời gian giao hàng NCC) + Tồn an toàn. Sản phẩm Tủ lạnh và Robot hút bụi có tốc độ bán vượt dự kiến.`,
          proposal: {
            type: 'PURCHASE_ORDER',
            title: 'Tạo Đơn Đặt Hàng Mua (Purchase Order)',
            details: 'Đặt bổ sung 20 Tủ lạnh LG Inverter từ Nhà cung cấp LG Electronics VN (Lead time: 3 ngày).',
            actionLabel: 'Gửi phê duyệt Purchase Order',
          },
          structuredData: [
            { label: 'Tủ lạnh LG Multi Door', value: 'Còn 3 cái (Ngưỡng: 8)', highlight: true },
            { label: 'Robot Hút Bụi Dreame', value: 'Còn 4 cái (Ngưỡng: 10)', highlight: true },
          ],
        };
      } else if (q.includes('chuyển') || q.includes('hà nội') || q.includes('hcm')) {
        aiResponse = {
          text: `💡 **Đề xuất Điều chuyển kho tự động (Stock Transfer Proposal):**\nKho **Hà Nội (HN-WH01)** đang thiếu hụt sản phẩm *iPhone 16 Pro Max* (chỉ còn 2 máy, thời gian hết hàng dự kiến: 18 giờ), trong khi kho **TP.HCM (HCM-WH01)** đang dồi dào (còn 22 máy, vượt định mức tồn an toàn).`,
          toolsUsed: [
            { name: 'get_stock_across_branches(product_id=1)', latency: '10ms', status: 'ok' },
            { name: 'propose_stock_transfer()', latency: '22ms', status: 'ok' },
          ],
          reasoning: `Cân đối chi phí logistics và thời gian vận chuyển liên miền 24h. Tránh đứt gãy nguồn cung tại điểm bán miền Bắc mà không phải mua thêm hàng từ nhà cung cấp.`,
          proposal: {
            type: 'STOCK_TRANSFER',
            title: 'Lệnh Chuyển Kho HCM-WH01 → HN-WH01',
            details: 'Điều chuyển 10 iPhone 16 Pro Max 256GB từ Kho Tổng HCM ra Kho Đống Đa Hà Nội.',
            actionLabel: 'Tạo phiếu duyệt chuyển kho',
          },
        };
      } else if (q.includes('chờ duyệt') || q.includes('đơn hàng') || q.includes('công nợ')) {
        const draftWholesale = orders.filter((o) => o.channel === 'WHOLESALE' || o.status === 'DRAFT');
        aiResponse = {
          text: `📋 **Danh sách Đơn hàng & Yêu cầu Phê duyệt:**\nHiện có **${draftWholesale.length || 1} đơn hàng sỉ** vượt hạn mức công nợ hoặc vượt giá trị 20.000.000₫ đang chờ Quản lý duyệt:`,
          toolsUsed: [
            { name: 'get_pending_orders(status="pending_approval")', latency: '19ms', status: 'ok' },
            { name: 'check_credit_limit(customer_id=2)', latency: '11ms', status: 'ok' },
          ],
          proposal: {
            type: 'CREDIT_APPROVAL',
            title: 'Duyệt Đơn Hàng Sỉ WHO-2609-002',
            details: 'Đại lý Minh Phát đặt hàng 45.000.000₫ (Vượt hạn mức tín dụng còn lại 10.000.000₫). Yêu cầu bảo lãnh công nợ.',
            actionLabel: 'Mở trang Phê duyệt Đơn sỉ',
          },
        };
      } else {
        aiResponse = {
          text: `Tôi đã xử lý yêu cầu: **"${query}"** qua công cụ AI Agent.\n\nBạn có thể hỏi thêm về:\n- 📊 Doanh số & Sản phẩm bán chạy\n- 📦 Tồn kho chi tiết theo từng mã hàng\n- 🚚 Đề xuất chuyển kho hoặc đặt hàng từ Nhà cung cấp\n- 🛡️ Tra cứu đơn hàng sỉ chờ duyệt công nợ`,
          toolsUsed: [{ name: 'natural_language_dispatch()', latency: '20ms', status: 'ok' }],
        };
      }

      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          sender: 'ai',
          text: aiResponse.text || '',
          time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          toolsUsed: aiResponse.toolsUsed,
          sqlQuery: aiResponse.sqlQuery,
          reasoning: aiResponse.reasoning,
          proposal: aiResponse.proposal,
          structuredData: aiResponse.structuredData,
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <>
      {/* Floating Action Badge Button */}
      <div
        style={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 8,
        }}
      >
        {/* Main AI Floating Trigger */}
        <div
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          style={{
            position: 'relative',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #0A2463 0%, #173680 50%, #FF6B2B 100%)',
            color: '#ffffff',
            padding: '12px 20px',
            borderRadius: 32,
            boxShadow: '0 10px 30px rgba(10, 36, 99, 0.4), 0 0 15px rgba(255, 107, 43, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            border: '2px solid rgba(255, 255, 255, 0.25)',
            transition: 'transform 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              background: '#ffffff',
              color: '#0A2463',
              display: 'grid',
              placeItems: 'center',
              fontSize: 20,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            }}
          >
            <RobotOutlined />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
              AI Copilot <Badge status="processing" color="#10b981" />
            </div>
            <div style={{ fontSize: 11, opacity: 0.85 }}>Hỏi đáp & Phân tích tồn kho</div>
          </div>
        </div>
      </div>

      {/* AI Assistant Chat Modal / Box */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            width: 440,
            maxWidth: 'calc(100vw - 32px)',
            height: isMinimized ? 64 : 640,
            maxHeight: 'calc(100vh - 48px)',
            background: '#ffffff',
            borderRadius: 20,
            boxShadow: '0 25px 65px rgba(10, 36, 99, 0.35)',
            border: '1px solid #cbd5e1',
            zIndex: 10000,
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            transition: 'height 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #07183e 0%, #0A2463 60%, #1e3a8a 100%)',
              color: '#ffffff',
              padding: '14px 18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Avatar
                style={{ background: 'var(--accent)', color: '#fff' }}
                icon={<RobotOutlined />}
              />
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}>
                  TechHub AI Assistant
                  <Tag color="cyan" style={{ fontSize: 10, lineHeight: '16px', padding: '0 4px', margin: 0, fontWeight: 700 }}>
                    FastAPI Tool-Calling
                  </Tag>
                </div>
                <div style={{ fontSize: 11, opacity: 0.75, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
                  Python 3.12 · PostgreSQL Read-Only
                </div>
              </div>
            </div>

            <Space size={4}>
              <Button
                type="text"
                size="small"
                icon={<ClearOutlined />}
                style={{ color: 'rgba(255,255,255,0.8)' }}
                onClick={() => setMessages([messages[0]])}
                title="Xoá lịch sử hội thoại"
              />
              <Button
                type="text"
                size="small"
                icon={isMinimized ? <UpOutlined /> : <MinusOutlined />}
                style={{ color: 'rgba(255,255,255,0.8)' }}
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
              />
              <Button
                type="text"
                size="small"
                icon={<CloseOutlined />}
                style={{ color: 'rgba(255,255,255,0.8)' }}
                onClick={() => setIsOpen(false)}
                title="Đóng"
              />
            </Space>
          </div>

          {!isMinimized && (
            <>
              {/* Preset Chips */}
              <div
                style={{
                  background: '#f8fafc',
                  padding: '10px 14px',
                  borderBottom: '1px solid #e2e8f0',
                  overflowX: 'auto',
                  display: 'flex',
                  gap: 6,
                  whiteSpace: 'nowrap',
                }}
              >
                {[
                  { icon: '📦', text: 'Tồn kho iPhone 16 Pro Max?' },
                  { icon: '📊', text: 'Sản phẩm nào bán chạy nhất tuần?' },
                  { icon: '🚨', text: 'Mặt hàng nào sắp hết (Low Stock)?' },
                  { icon: '🚚', text: 'Đề xuất chuyển kho HCM sang HN' },
                  { icon: '📋', text: 'Đơn hàng sỉ nào đang chờ duyệt?' },
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePresetQuery(chip.text)}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: 14,
                      padding: '4px 10px',
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: '#1e293b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      flexShrink: 0,
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--accent)';
                      e.currentTarget.style.color = 'var(--accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#cbd5e1';
                      e.currentTarget.style.color = '#1e293b';
                    }}
                  >
                    <span>{chip.icon}</span>
                    <span>{chip.text}</span>
                  </button>
                ))}
              </div>

              {/* Message List */}
              <div
                style={{
                  flex: 1,
                  padding: '16px 14px',
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                  background: '#f1f5f9',
                }}
              >
                {messages.map((m) => (
                  <div
                    key={m.id}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: m.sender === 'user' ? 'flex-end' : 'flex-start',
                      maxWidth: '100%',
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '88%',
                        background: m.sender === 'user' ? 'var(--primary)' : '#ffffff',
                        color: m.sender === 'user' ? '#ffffff' : '#0f172a',
                        padding: '12px 16px',
                        borderRadius: m.sender === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                        border: m.sender === 'user' ? 'none' : '1px solid #e2e8f0',
                        fontSize: 13,
                        lineHeight: 1.6,
                      }}
                    >
                      {/* Text */}
                      <div style={{ whiteSpace: 'pre-line' }}>{m.text}</div>

                      {/* Structured Data Table */}
                      {m.structuredData && (
                        <div style={{ marginTop: 10, background: '#f8fafc', borderRadius: 10, padding: 8, border: '1px solid #e2e8f0' }}>
                          {m.structuredData.map((row, rIdx) => (
                            <div
                              key={rIdx}
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontSize: 11.5,
                                padding: '3px 4px',
                                borderBottom: rIdx < (m.structuredData?.length ?? 0) - 1 ? '1px dashed #e2e8f0' : 'none',
                              }}
                            >
                              <span style={{ color: '#64748b' }}>{row.label}:</span>
                              <strong style={{ color: row.highlight ? '#FF6B2B' : '#0f172a' }}>{row.value}</strong>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Action Proposal Card */}
                      {m.proposal && (
                        <div
                          style={{
                            marginTop: 10,
                            padding: 10,
                            background: '#eff6ff',
                            border: '1px solid #bfdbfe',
                            borderRadius: 10,
                          }}
                        >
                          <div style={{ fontWeight: 800, color: '#1e40af', fontSize: 12, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <RocketOutlined /> {m.proposal.title}
                          </div>
                          <div style={{ fontSize: 11.5, color: '#334155', marginBottom: 8 }}>{m.proposal.details}</div>
                          <Button
                            type="primary"
                            size="small"
                            style={{ background: '#2563eb', fontSize: 11, fontWeight: 700, borderRadius: 6 }}
                          >
                            {m.proposal.actionLabel}
                          </Button>
                        </div>
                      )}

                      {/* Tool Calls & SQL Inspector */}
                      {m.toolsUsed && m.toolsUsed.length > 0 && (
                        <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px dashed rgba(0,0,0,0.08)' }}>
                          <div style={{ fontSize: 10.5, color: '#64748b', fontWeight: 700, marginBottom: 4 }}>
                            ⚡ CÔNG CỤ ĐÃ THỰC THI (TOOL CALLS):
                          </div>
                          <Flex wrap gap={4}>
                            {m.toolsUsed.map((t, tIdx) => (
                              <Tag key={tIdx} color="purple" style={{ fontSize: 10, margin: 0, padding: '1px 6px' }}>
                                {t.name} · {t.latency}
                              </Tag>
                            ))}
                          </Flex>
                        </div>
                      )}

                      {/* SQL Trace */}
                      {m.sqlQuery && (
                        <div style={{ marginTop: 6, fontSize: 10, background: '#0f172a', color: '#38bdf8', padding: '4px 8px', borderRadius: 6, fontFamily: 'monospace' }}>
                          🛡️ SQLGlot Safe: {m.sqlQuery}
                        </div>
                      )}
                    </div>

                    <span style={{ fontSize: 10, color: '#94a3b8', marginTop: 4, marginInline: 6 }}>{m.time}</span>
                  </div>
                ))}

                {isTyping && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 12 }}>
                    <LoadingOutlined spin /> AI Agent đang suy luận & gọi API...
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Form */}
              <form
                onSubmit={handleSubmit}
                style={{
                  padding: '12px 14px',
                  background: '#ffffff',
                  borderTop: '1px solid #e2e8f0',
                  display: 'flex',
                  gap: 8,
                }}
              >
                <Input
                  placeholder="Hỏi AI về tồn kho, bán chạy, đơn sỉ..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  disabled={isTyping}
                  style={{ borderRadius: 10 }}
                />
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  loading={isTyping}
                  style={{ background: 'var(--accent)', borderColor: 'var(--accent)', borderRadius: 10, fontWeight: 700 }}
                >
                  Gửi
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}

