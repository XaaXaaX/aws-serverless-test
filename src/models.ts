import { EventModel, InitEvent } from "./event-model";

export enum EventType {
    Created = 'eu.aviv.myentity.created',
    Deleted = 'eu.aviv.myentity.deleted',
    Updated = 'eu.aviv.myentity.updated',
    Suspended = 'eu.aviv.myentity.suspended',
    // Theses are examples and you need provide meaningful domain base event type
    // This relates to the Capability and its domain context

} 
export const source = 'platform:domain:exampleproducer';

export type EventMetaInfo = { entityId: string };
export type EventData = {  }

export type EventEntity = EventMetaInfo & EventData;

export type DataUpdated<T> = EventModel<T, EventType.Updated>;
export type DataDeleted<T> = EventModel<T, EventType.Deleted>;
export type DataCreated<T> = EventModel<T, EventType.Created>;

export type NotificationUpdated = DataUpdated<EventMetaInfo>
export type NotificationDeleted = DataUpdated<EventMetaInfo>;
export type NotificationCreated = DataUpdated<EventMetaInfo>;

type NotificationEvent = NotificationCreated | NotificationDeleted | NotificationUpdated

export type IntegrationUpdated = DataUpdated<EventEntity>
export type IntegrationDeleted = DataDeleted<EventEntity>;
export type IntegrationCreated = DataCreated<EventEntity>;

export type IntegrationEvent =   IntegrationUpdated | IntegrationDeleted | IntegrationCreated;

export const CreateNotificationEvent = (event: EventMetaInfo, type: EventType): EventModel<NotificationEvent, EventType> => {
    return InitEvent(
        event.entityId,
        source,
        type,
        "NOTIFICATION");
}

export const CreateIntegrationEvent = (event: EventEntity, type: EventType): EventModel<EventEntity, EventType> => {
    return InitEvent(
        event.entityId,
        source,
        type,
        "INTEGRATION",
        "EventEntity#Components/schema/EventEntity",
        event,
        '1.0.0' );
}
