from flask import Flask, request, jsonify
import sys
import feedparser
from transformers import pipeline

app = Flask(__name__)

@app.route('/api/sentiment', methods=['POST'])
def get_sentiment():
    data = request.get_json()
    ticker = data.get('ticker', 'NVDA')  # Default to NVDA if not provided
    keyword = 'Nvidia'
    
    # Initialize pipeline
    pipe = pipeline("text-classification", model="ProsusAI/finbert")
    
    # Fetch RSS feed
    rss_url = f'https://finance.yahoo.com/rss/headline?s={ticker}'
    feed = feedparser.parse(rss_url)
    
    total_score = 0
    num_articles = 0
    
    for article in feed.entries:
        if keyword.lower() not in article.summary.lower():
            continue
            
        sentiment = pipe(article.summary)[0]

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
            'final_score': final_score
        })
    else:
        return jsonify({'overall_sentiment': 'No articles', 'final_score': 0.0})

if __name__ == '__main__':
    app.run(debug=True)
