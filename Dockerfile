# Stage 1: Build React app
FROM node:14 AS build

WORKDIR /app

# Copy the frontend code
COPY Frontend/package.json ./
COPY Frontend/ ./

# Install dependencies and build the React app
RUN npm install
RUN npm run build

# Stage 2: Set up Flask app
FROM python:3.11.9-slim

WORKDIR /app

# Copy the backend code
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY Backend/ /app/Backend

# Copy the built React app from the previous stage
COPY --from=build /app/build /app/Frontend/build

# Set environment variables
ENV FLASK_APP=Backend/WebApp/app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Expose the port Flask will run on
EXPOSE 5000

# Run the Flask app
CMD ["flask", "run"]