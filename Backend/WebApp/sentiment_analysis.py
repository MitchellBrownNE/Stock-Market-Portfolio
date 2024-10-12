import feedparser
from transformers import pipeline

# Initialize the sentiment analysis pipeline
import feedparser
from transformers import pipeline

# Initialize pipeline
pipe = pipeline("text-classification", model="ProsusAI/finbert")

def analyze_feed(ticker):
    # Fetch RSS feed
    rss_url = f'https://finance.yahoo.com/rss/headline?s={ticker}'
    feed = feedparser.parse(rss_url)

    total_score = 0
    num_articles = 0

    for article in feed.entries:
        sentiment = pipe(article.summary)[0]

        if sentiment['label'] == 'positive':
            total_score += sentiment['score']
        elif sentiment['label'] == 'negative':
            total_score -= sentiment['score']
        
        num_articles += 1

    # Calculate overall sentiment
    if num_articles > 0:
        final_score = total_score / num_articles
        overall_sentiment = (
            "Positive" if final_score >= 0.15 else
            "Negative" if final_score <= -0.15 else
            "Neutral"
        )
        return {
            "overall_sentiment": overall_sentiment,
            "final_score": final_score
        }
    else:
        return None  # No articles found

# The function can now be called in the Flask app


# If this module is run directly, this block will execute
if __name__ == "__main__":
    ticker = 'NVDA'  # Default ticker
    print("Fetching new articles and analyzing sentiment...\n")
    result = perform_sentiment_analysis(ticker)
    print("Sentiment analysis completed.")
