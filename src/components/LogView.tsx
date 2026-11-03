import React, { useEffect, useRef } from 'react';
import { LogMessage } from '../types';

interface LogViewProps {
  logs: LogMessage[];
}

export const LogView: React.FC<LogViewProps> = ({ logs }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const getColor = (type: LogMessage['type']) => {
    switch (type) {
      case 'combat': return 'var(--c-red)';
      case 'danger': return 'var(--c-yellow)';
      case 'gain': return 'var(--c-cyan)';
      case 'heal': return 'var(--c-green)';
      default: return '#abb2bf';
    }
  };

  return (
    <div
      className="pixel-panel"
      style={{
        marginTop: '14px',
        maxHeight: '130px',
        overflowY: 'auto',
        fontSize: '7px',
        lineHeight: '1.6',
        backgroundColor: '#0c0e14',
      }}
    >
      <div style={{ color: '#555e77', marginBottom: '4px', borderBottom: '1px solid #1f2535', paddingBottom: '2px' }}>
        📜 EXPEDITION CHRONICLE
      </div>
      {logs.map((log) => (
        <div key={log.id} style={{ color: getColor(log.type), marginBottom: '2px' }}>
          <span style={{ color: '#444c60' }}>[{log.timestamp}]</span> {log.text}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
