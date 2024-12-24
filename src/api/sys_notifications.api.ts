export interface SystemNotification {
  id: number;
  type: 'Success' | 'Warning' | 'Error';
  description: string;
  is_read: boolean;
  created_at: string;
  viewed: boolean;
}

// Map backend types to existing notification types
export const typeMapping = {
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
} as const;
