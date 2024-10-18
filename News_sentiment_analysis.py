import requests

# Use a pipeline as a high-level helper
from transformers import pipeline

API_KEY =open('API_KEY').read()

keyword = 'gold'
date = '2024-8-18'

pipe = pipeline("text-classification", model="ProsusAI/finbert")

url = f'https://finance.yahoo.com/rss/headline?s={ticker}'

feed = (
    'https://newwwsapi.org/v2/everything?'
    f'q={keyword}'
    f'from={date}'
    'sortBy=popularity&'
    'apiKey={API_KEY}'
)

response = requests.get(url)

articles = response.json()['articles']
articles = [article for article in articles if keyword.lower()in article['title'].lower() or keyword.lower() in article['description'].lower()]

total_score = 0
num_articles = 0

for i, article  in enumerate(feed.entries):
    if keyword.lower() not in entry.summary.lower():
        continue

    print(f'Title: {article["title"]}')
    print(f'Link: {article["url"]}')
    print(f'Published: {article["description"]}')


    sentiment = pipe(article['content'])[0]

    print(f'Sentiment {sentiment["label"]}, Score: {sentiment["score"]}')
    print('-' * 40)

    if sentiment['label'] == 'positive':
        total_score += sentiment['score']
        num_articles +=1
    elif sentiment['label'] == 'negative':
        total_score -= sentiment['score']
        num_articles +=1

final_score = total_score/ num_articles

print(f'Overall sentiment: {"Positive" if final_score >= 0.15 else "negative" if final_score <= -0.15 else "Neutral"} {final_score}')
    
