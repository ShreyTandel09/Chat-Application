from django.core.mail import send_mail
from django.conf import settings

def send_registration_email(user_email):
    try:
        send_mail(
            'Welcome to Chat App',
            'Thank you for registering!',
            settings.DEFAULT_FROM_EMAIL,
            [user_email],
            fail_silently=False,
        )
        print(f"Email sent to {user_email}")
    except Exception as e:
        print(f"Failed to send email: {str(e)}")