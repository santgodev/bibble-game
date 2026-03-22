import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export const NotificationService = {
  registerForPushNotificationsAsync: async () => {
    let token;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    
    // In a real app, you'd get the token here:
    // token = (await Notifications.getExpoPushTokenAsync()).data;
    // console.log(token);

    return token;
  },

  scheduleCuriosityNotification: async (title: string, body: string, seconds: number = 5) => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { data: 'goes here' },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds,
      },
    });
  },

  scheduleDailyReminder: async () => {
    // Examples of curiosity gap notifications
    const messages = [
      { title: "¡Recomenzó la fiesta!", body: "Alguien convirtió el agua en algo mejor... Entra para ver cómo." },
      { title: "Cuenta Saldada 😳", body: "Revisamos tu saldo y alguien pagó el 100% de tu deuda hoy." },
      { title: "Nicodemo te busca...", body: "Tiene una pregunta que solo se puede responder de noche. ¿Vienes?" },
      { title: "Misión: El Pozo 💧", body: "Hay un agua que quita la sed para siempre. Está disponible ahora." }
    ];

    const randomMsg = messages[Math.floor(Math.random() * messages.length)];

    await Notifications.scheduleNotificationAsync({
      content: {
        title: randomMsg.title,
        body: randomMsg.body,
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 9,
        minute: 0,
      },
    });
  }
};
