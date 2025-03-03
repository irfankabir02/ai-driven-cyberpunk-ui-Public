from ted_google_analytics import fetch_active_users, fetch_top_pages

def ted_google_analytics_action(action, params=None):
    """
    Handles Google Analytics actions within TED.
    """
    if action == "active_users":
        return fetch_active_users()
    elif action == "top_pages":
        limit = params.get("limit", 5) if params else 5
        return fetch_top_pages(limit)
    else:
        return "⚠️ Unknown action requested."
