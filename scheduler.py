from datetime import datetime

def create_meeting(title, date_time):

    try:
        dt = datetime.strptime(date_time, "%Y-%m-%d %H:%M")

        return f"Meeting '{title}' scheduled on {dt}"

    except:
        return "Invalid date format. Use YYYY-MM-DD HH:MM"