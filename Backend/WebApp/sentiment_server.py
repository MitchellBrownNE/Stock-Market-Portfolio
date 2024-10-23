from flask import Flask, request, jsonify
from flask_cors import CORS
import feedparser
from transformers import pipeline

app = Flask(__name__)
CORS(app)

# Function to perform sentiment analysis
def analyze_sentiment(ticker):
    # Replace this URL with the actual URL for the RSS feed you are using
    rss_url = f'https://finance.yahoo.com/rss/headline?s={ticker}'
    print(f"Fetching RSS feed from: {rss_url}")  # Debugging log to check RSS feed URL
    
    feed = feedparser.parse(rss_url)
    sentiment_analyzer = pipeline("sentiment-analysis")

    results = []

    if not feed.entries:
        print(f"No entries found for {ticker}")  # Log if the feed is empty
        return {'error': f"No RSS feed entries found for {ticker}"}

    for entry in feed.entries:
        try:
            sentiment_result = sentiment_analyzer(entry.summary)
            results.append({
                'title': entry.title,
                'summary': entry.summary,
                'sentiment': sentiment_result[0]['label'],
                'score': sentiment_result[0]['score']
            })
        except Exception as e:
            print(f"Error analyzing sentiment for {entry.title}: {str(e)}")  # Log any errors in sentiment analysis
            continue  # Skip problematic entries
    
    return {
        'ticker': ticker,
        'sentiments': results if results else "No sentiments found"
    }

@app.route('/api/sentiment', methods=['POST'])
def get_sentiment():
    data = request.get_json()
    ticker = data.get('ticker')
    
    if not ticker:
        return jsonify({'error': 'Ticker symbol is required'}), 400

    print(f"Received request for sentiment analysis of {ticker}")  # Debug log to track requests

    sentiment_data = analyze_sentiment(ticker)

    # Return an error response if no sentiment data is available
    if 'error' in sentiment_data:
        return jsonify(sentiment_data), 404

    return jsonify(sentiment_data)

if __name__ == '__main__':
    app.run(debug=True, port=5001)  # Running on a different port if the main app is on 5000
