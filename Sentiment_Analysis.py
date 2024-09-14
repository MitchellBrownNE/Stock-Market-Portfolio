import feedparser
from transformers import pipeline
import time

# Set ticker and keyword
ticker = 'NVDA'
keyword = 'NVIDIA'

# Initialize pipeline
pipe = pipeline("text-classification", model="ProsusAI/finbert")

# Function to perform sentiment analysis on the feed
def analyze_feed():
    # Fetch RSS feed
    rss_url = f'https://finance.yahoo.com/rss/headline?s={ticker}'
    feed = feedparser.parse(rss_url)

    # Initialize variables
    total_score = 0
    num_articles = 0

    # Parse the feed entries
    for article in feed.entries:
        if keyword.lower() not in article.summary.lower():
            continue

        print(f'Title: {article.title}')
        print(f'Link: {article.link}')
        print(f'Published: {article.published}')
        print(f'Summary: {article.summary}')

        sentiment = pipe(article.summary)[0]

        print(f'Sentiment: {sentiment["label"]}, Score: {sentiment["score"]}')
        print('-' * 40)

        if sentiment['label'] == 'positive':
            total_score += sentiment['score']
        elif sentiment['label'] == 'negative':
            total_score -= sentiment['score']
        
        num_articles += 1

    # Calculate and print the final score
    if num_articles > 0:
        final_score = total_score / num_articles
        overall_sentiment = (
            "Positive" if final_score >= 0.15 else
            "Negative" if final_score <= -0.15 else
            "Neutral"
        )
        print(f'Overall sentiment: {overall_sentiment} ({final_score:.2f})')
    else:
        print("No articles matched the keyword.")

# Main loop for continuous sentiment analysis
try:
    while True:
        print("Fetching new articles and analyzing sentiment...\n")
        analyze_feed()
        print("\nWaiting for the next update...\n")
        time.sleep(60)  # Wait for 60 seconds before checking again
except KeyboardInterrupt:
    print("\nSentiment analysis stopped.")
