from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import feedparser
from transformers import pipeline

app = Flask(__name__)
CORS(app)  # Enable CORS for the app

@app.route('/api/sentiment', methods=['POST'])
def get_sentiment():
    data = request.get_json()
    ticker = data.get('ticker', 'NVDA').upper()  # Default to NVDA if not provided and convert to uppercase
    keyword = ticker  # Use the ticker as the keyword
    
    # Initialize pipeline
    pipe = pipeline("text-classification", model="ProsusAI/finbert")
    
    # Fetch RSS feed
    rss_url = f'https://finance.yahoo.com/rss/headline?s={ticker}'
    feed = feedparser.parse(rss_url)

    print(f"Fetched {len(feed.entries)} articles for ticker {ticker}.")  # Log the number of fetched articles
    
    total_score = 0
    num_articles = 0
    articles_list = []  # Initialize a list to store relevant articles

    for article in feed.entries:
        print(f"Processing article: {article.title}")  # Print article title
        
        if keyword.lower() not in article.summary.lower():
            continue
            
        sentiment = pipe(article.summary)[0]
        print(f"Sentiment: {sentiment['label']}, Score: {sentiment['score']}")  # Log sentiment

        articles_list.append(article.title)  # Store the article title

        if sentiment['label'] == 'positive':
            total_score += sentiment['score']
        elif sentiment['label'] == 'negative':
            total_score -= sentiment['score']
        
        num_articles += 1
    
    if num_articles > 0:
        final_score = total_score / num_articles
        overall_sentiment = (
            "Positive" if final_score >= 0.15 else
            "Negative" if final_score <= -0.15 else
            "Neutral"
        )
        return jsonify({
            'overall_sentiment': overall_sentiment,
            'final_score': final_score,
            'articles': articles_list  # Include the list of articles in the response
        })
    else:
        return jsonify({'overall_sentiment': 'No articles', 'final_score': 0.0, 'articles': []})


if __name__ == '__main__':
    app.run(debug=True)
