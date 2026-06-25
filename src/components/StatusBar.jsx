/** Mock status bar — swap for a real device status bar if needed */
export function StatusBar() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '14px 28px 0',
      color: '#f5f5f5',
      fontSize: 15,
      fontWeight: 700,
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        {/* Signal bars */}
        <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
          <rect x="0"   y="4"   width="3" height="8"   rx="1" fill="#f5f5f5" opacity="0.4"/>
          <rect x="4.5" y="2.5" width="3" height="9.5" rx="1" fill="#f5f5f5" opacity="0.6"/>
          <rect x="9"   y="0"   width="3" height="12"  rx="1" fill="#f5f5f5"/>
          <rect x="13.5" y="1" width="3" height="10" rx="1.5" fill="none" stroke="#f5f5f5" strokeWidth="1.2"/>
          <rect x="14.3" y="2.5" width="1.4" height="5" rx="0.5" fill="#f5f5f5"/>
        </svg>
        {/* WiFi */}
        <svg width="16" height="12" viewBox="0 0 16 12" fill="#f5f5f5">
          <path d="M8 2C10.5 2 12.7 3.1 14.2 4.8L15.5 3.3C13.6 1.3 11 0 8 0C5 0 2.4 1.3 0.5 3.3L1.8 4.8C3.3 3.1 5.5 2 8 2Z" opacity="0.4"/>
          <path d="M8 5C9.6 5 11.1 5.7 12.1 6.8L13.4 5.3C12.1 3.9 10.1 3 8 3C5.9 3 3.9 3.9 2.6 5.3L3.9 6.8C4.9 5.7 6.4 5 8 5Z" opacity="0.7"/>
          <path d="M8 8C9 8 9.9 8.4 10.5 9.1L11.9 7.6C10.9 6.5 9.5 5.8 8 5.8C6.5 5.8 5.1 6.5 4.1 7.6L5.5 9.1C6.1 8.4 7 8 8 8Z"/>
          <circle cx="8" cy="11" r="1.2"/>
        </svg>
        {/* Battery */}
        <svg width="25" height="12" viewBox="0 0 25 12" fill="none">
          <rect x="0.5" y="0.5" width="21" height="11" rx="3.5" stroke="#f5f5f5" strokeOpacity="0.35"/>
          <rect x="2" y="2" width="16" height="8" rx="2" fill="#f5f5f5"/>
          <path d="M22.5 4.5C23.3 4.8 23.3 7.2 22.5 7.5" stroke="#f5f5f5" strokeOpacity="0.5" strokeWidth="1.2" strokeLinecap="round"/>
        </svg>
      </div>
    </div>
  );
}
