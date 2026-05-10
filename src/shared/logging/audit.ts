export interface AuditEvent {
  action: string;
  entity: string;
  entityId?: string;
  actorUserId?: string;
  hospitalId?: string;
  requestId?: string;
  ip?: string;
  metadata?: Record<string, unknown>;
}

export const logAuditEvent = (event: AuditEvent): void => {
  console.info({ ...event, eventType: 'AUDIT' }, 'Audit event');
};
