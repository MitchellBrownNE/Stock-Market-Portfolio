# Stage 1: Build React app
FROM node:14 AS build

WORKDIR /app

# Copy the frontend code
COPY Frontend/profitpulsex/package.json ./package.json
COPY Frontend/profitpulsex/vite.config.js ./vite.config.js
COPY Frontend/profitpulsex/ ./


RUN ls -la /app
# Install dependencies and build the React app
RUN npm install
RUN npm run build

# Stage 2: Set up Flask app
FROM python:3.11.9-slim

WORKDIR /app

# Copy the backend code
COPY Backend/ /app/Backend

# Copy the built React app from the previous stage
COPY --from=build /app/dist /app/Frontend/profitpulsex/dist

# Copy the requirements file and install dependencies
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Set environment variables
ENV FLASK_APP=Backend/WebApp/app.py
ENV FLASK_RUN_HOST=0.0.0.0

# Expose the port Flask will run on
EXPOSE 5000

# Run the Flask app
CMD ["flask", "run"]