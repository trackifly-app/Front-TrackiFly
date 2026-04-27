export interface AdminLog {
  id: string;
  action: string;
  description: string;
  created_at: string;
}

export async function getAdminLogs(): Promise<AdminLog[]> {
  return [];
}
