import { Notification, nativeImage } from 'electron';
import path from 'node:path'

interface NotificationOptions {
    title: string;
    body: string;
    iconPath?: string;
}

const SendNotification = ({ title, body, iconPath }: NotificationOptions) => {
    new Notification({
        title: title,
        body: body,
        icon: iconPath ? nativeImage.createFromPath(iconPath) : nativeImage.createFromPath(path.join(process.env.VITE_PUBLIC, 'system-tray-icon-white.png'))
    }).show();
}

export default SendNotification;