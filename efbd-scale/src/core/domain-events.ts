export enum DomainEventType {
  SCALE_UPDATED = 'SCALE_UPDATED',
  TRIGGER_RECORDED = 'TRIGGER_RECORDED',
}

export interface DomainEvent<TPayload = unknown> {
  type: DomainEventType;
  payload: TPayload;
  occurredAt: Date;
}
