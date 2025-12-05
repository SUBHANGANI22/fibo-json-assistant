import { message } from 'antd';
import type { MessageInstance } from 'antd/es/message/interface';

let messageApi: MessageInstance;

export const initializeToast = (api: MessageInstance) => {
  messageApi = api;
};

export const toast = {
  success: (content: string) => {
    messageApi?.open({
      type: 'success',
      content,
    });
  },
  error: (content: string) => {
    messageApi?.open({
      type: 'error',
      content,
    });
  },
  warning: (content: string) => {
    messageApi?.open({
      type: 'warning',
      content,
    });
  },
  info: (content: string) => {
    messageApi?.open({
      type: 'info',
      content,
    });
  },
};