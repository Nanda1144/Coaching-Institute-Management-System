import { notificationService } from '../../modules/notification/notification.service';

export async function sendNotification(title: string, message: string, target: string) {
  try {
    await notificationService.send({ title, message, target });
  } catch {
    // best-effort
  }
}
