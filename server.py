from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

# 1️⃣ Define paths
PROJECT_PATH = r"C:\PythonProjects"
BUILD_FOLDER = os.path.join(PROJECT_PATH, "build")

# 2️⃣ Create Flask app
app = Flask(__name__, static_folder=BUILD_FOLDER, static_url_path="/")
CORS(app)

# 3️⃣ Environment Variables
API_KEY = os.getenv("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")
DEBUG_MODE = os.getenv("DEBUG_MODE", "false").lower() == "true"

# 4️⃣ Serve the React App
@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react_app(path):
    """
    Serves the React frontend from the 'build' folder.
    If the requested file exists, return it.
    Otherwise, serve 'index.html' to enable client-side routing.
    """
    full_path = os.path.join(BUILD_FOLDER, path)
    if path and os.path.exists(full_path):
        return send_from_directory(BUILD_FOLDER, path)
    return send_from_directory(BUILD_FOLDER, "index.html")

# 5️⃣ AI-Driven Insights API
@app.route("/api/insights", methods=["POST"])
def ai_insights():
    """
    Simulates AI-generated insights based on user data.
    Expects JSON with a 'query' field.
    """
    data = request.json
    if not data or "query" not in data:
        return jsonify({"error": "Missing 'query' field"}), 400

    # Example "AI" logic: a pseudo-random success chance
    success_chance = round(70 + 30 * (hash(data["query"]) % 100) / 100, 2)
    response = {
        "query": data["query"],
        "insights": f"Cyberpunk AI predicts a {success_chance}% chance of success."
    }
    return jsonify(response)

# 6️⃣ Run the Flask App
if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="127.0.0.1", port=port, debug=DEBUG_MODE)
