export interface AppNotification {
  id: number,
  user_id: number,
  datetime: any,
  status?: number,
  text: string,
  link?: any,
  type?: number,
  event_type: string,
  event_id?: number,
  priority?: number,
  created?: string,
  updated?: string,
  notification_style:string,
  notification_type:string
};
