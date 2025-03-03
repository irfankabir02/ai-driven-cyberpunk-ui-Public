import os
from google.oauth2 import service_account
from google.analytics.data import BetaAnalyticsDataClient
from google.analytics.data import RunReportRequest

# Load credentials
SERVICE_ACCOUNT_FILE = r"C:\PythonProjects\service_account.json"
PROPERTY_ID = "YOUR_GA4_PROPERTY_ID"

credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=["https://www.googleapis.com/auth/analytics.readonly"]
)

client = BetaAnalyticsDataClient(credentials=credentials)

def fetch_active_users():
    """Fetches the number of active users from Google Analytics."""
    request = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        date_ranges=[{"start_date": "7daysAgo", "end_date": "today"}],
        metrics=[{"name": "activeUsers"}]
    )

    response = client.run_report(request)
    for row in response.rows:
        return f"📊 Active Users in last 7 days: {row.metric_values[0].value}"

def fetch_top_pages(limit=5):
    """Fetches the top viewed pages in the last 7 days."""
    request = RunReportRequest(
        property=f"properties/{PROPERTY_ID}",
        date_ranges=[{"start_date": "7daysAgo", "end_date": "today"}],
        metrics=[{"name": "screenPageViews"}],
        dimensions=[{"name": "pagePath"}],
        order_bys=[{"metric": {"metric_name": "screenPageViews"}, "desc": True}]
    )

    response = client.run_report(request)
    results = []
    for row in response.rows[:limit]:
        results.append(f"🔹 Page: {row.dimension_values[0].value}, Views: {row.metric_values[0].value}")
    return "\n".join(results)
