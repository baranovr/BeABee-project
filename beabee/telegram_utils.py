import requests

from beabee_project.settings import TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID


def send_telegram_notification(message: str):
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        'chat_id': TELEGRAM_CHAT_ID,
        'text': message,
        'parse_mode': 'HTML',
    }

    try:
        response = requests.post(url, json=payload)
        response.raise_for_status()
        print("Notification send to Telegram")
    except requests.exceptions.RequestException as e:
        print(f"Sending error: {e}")
