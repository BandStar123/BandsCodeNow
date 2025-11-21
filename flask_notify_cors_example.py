from flask_cors import CORS
from flask import Flask, request, jsonify
# ---------- FLASK SERVER FOR KEY NOTIFY ----------
app = Flask(__name__)
CORS(app)

# Set your notification channel name here
KEY_NOTIFY_CHANNEL_NAME = "key-notify"

@app.route('/notify_key', methods=['POST'])
def notify_key():
    data = request.get_json()
    key = data.get('key')
    if not key:
        return jsonify({'error': 'No key provided'}), 400
    # Find the channel in all guilds
    for guild in bot.guilds:
        channel = discord.utils.get(guild.text_channels, name=KEY_NOTIFY_CHANNEL_NAME)
        if channel:
            # Send message in bot event loop
            bot.loop.create_task(channel.send(f"🔑 A player created a free key: `{key}`"))
    return jsonify({'status': 'ok'}), 200

def run_flask():
    app.run(host='0.0.0.0', port=5000)
