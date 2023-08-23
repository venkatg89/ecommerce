import { NotificationSetting } from 'src/constants/notifications'

export type NotificationsModel = Nullable<NotificationsSettingsModel>

interface NotificationsSettingsModel {
  [NotificationSetting.CAFE_STATUS_PUSH_ENABLED]?: boolean
  [NotificationSetting.MARKETING_PUSH_ENABLED]?: boolean
  [NotificationSetting.CAFE_OFFERS_PUSH_ENABLED]?: boolean
}
