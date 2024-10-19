# Stage 1: Build React app
FROM node:14 AS build

WORKDIR /app

# Copy the frontend code
COPY frontend/profitpulsex/package.json ./package.json
COPY frontend/profitpulsex/vite.config.js ./vite.config.js
COPY frontend/profitpulsex/ ./

# Install dependencies and build the React app
RUN npm install
RUN npx vite build

# Stage 2: Set up Flask app
FROM python:3.11.9-slim

WORKDIR /app

# Copy the backend code
COPY Backend/ /app/Backend

# Copy the built React app from the previous stage
COPY --from=build /app /app/Frontend/profitpulsex

# Copy the requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV FLASK_APP=Backend/WebApp/app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Expose the port Flask will run on
EXPOSE 5000

# Run the Flask app
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "Backend.WebApp.app:app"]