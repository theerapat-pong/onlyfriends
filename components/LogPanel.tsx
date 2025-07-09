import React from 'react';
import { LogEntry } from '../types';
import { 
    InformationCircleIcon, 
    ChatBubbleLeftRightIcon, 
    ShieldExclamationIcon, 
    CogIcon, 
    ExclamationTriangleIcon 
} from './Icons';

interface LogPanelProps {
  logs: LogEntry[];
}

const LogItem = ({ log }: { log: LogEntry }) => {
  const getLogStyle = () => {
    switch (log.type) {
      case 'info':
        return { icon: <InformationCircleIcon className="w-4 h-4 text-sky-400" />, color: 'text-sky-400' };
      case 'action':
        // This style is kept for completeness, though 'action' logs are now filtered out.
        return { icon: <ChatBubbleLeftRightIcon className="w-4 h-4 text-camfrog-text-muted" />, color: 'text-camfrog-text-muted' };
      case 'moderation':
        return { icon: <ShieldExclamationIcon className="w-4 h-4 text-yellow-400" />, color: 'text-yellow-400' };
      case 'system':
        return { icon: <CogIcon className="w-4 h-4 text-purple-400" />, color: 'text-purple-400' };
      case 'error':
        return { icon: <ExclamationTriangleIcon className="w-4 h-4 text-red-500" />, color: 'text-red-500' };
      default:
        return { icon: <InformationCircleIcon className="w-4 h-4 text-gray-500" />, color: 'text-gray-500' };
    }
  };

  const { icon, color } = getLogStyle();

  return (
    <li className="flex items-start text-xs font-mono py-1">
      <div className="flex-shrink-0 w-12 text-camfrog-text-muted">{log.timestamp}</div>
      <div className="flex-shrink-0 w-6">{icon}</div>
      <div className={`flex-1 break-words whitespace-pre-wrap ${color}`}>{log.message}</div>
    </li>
  );
};

const LogPanel = ({ logs }: LogPanelProps) => {
  // Filter out logs of type 'action' to hide user chat messages from the log, focusing on moderation and system events.
  const filteredLogs = logs.filter(log => log.type !== 'action');

  return (
    <div className="flex flex-col h-full text-camfrog-text">
        <h2 className="text-xs font-bold uppercase text-camfrog-text-muted px-2 mb-2">ประวัติการดำเนินการ</h2>
        <div className="flex-1 overflow-y-auto pr-1">
        {filteredLogs.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-camfrog-text-muted">ไม่มีประวัติที่สามารถแสดงได้</p>
          </div>
        ) : (
          <ul>
            {filteredLogs.map(log => <LogItem key={log.id} log={log} />)}
          </ul>
        )}
        </div>
    </div>
  );
};

export default LogPanel;