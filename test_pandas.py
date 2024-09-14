import pandas as pd

# Create a DataFrame
data = {
    'Name': ['Alice', 'Bob', 'Charlie', 'David'],
    'Age': [25, 30, 35, 40],
    'City': ['New York', 'Los Angeles', 'Chicago', 'Houston']
}

df = pd.DataFrame(data)

# Display the DataFrame
print(df)  # <--- Make sure to include print statements

# Accessing a specific column (Series)
print(df['Age'])

# Filter rows where Age is greater than 30
filtered_df = df[df['Age'] > 30]
print(filtered_df)

# Calculate the average age
average_age = df['Age'].mean()
print(f'Average Age: {average_age}')
