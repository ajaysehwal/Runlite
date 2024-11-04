#!/bin/bash
# wait-for-migrations.sh

# Maximum number of retries
MAX_RETRIES=30
# Delay between retries in seconds
RETRY_DELAY=2

echo "Waiting for database to be ready..."
retry_count=0

while [ $retry_count -lt $MAX_RETRIES ]; do
    # Try to connect to the database
    if npx prisma db push --skip-generate; then
        echo "Database is ready!"
        break
    fi
    
    echo "Database not ready. Retrying in $RETRY_DELAY seconds..."
    sleep $RETRY_DELAY
    retry_count=$((retry_count + 1))
done

if [ $retry_count -eq $MAX_RETRIES ]; then
    echo "Error: Maximum retries reached. Database is not available."
    exit 1
fi

echo "Running migrations..."
npx prisma migrate deploy

# Check if migrations were successful
if [ $? -eq 0 ]; then
    echo "Migrations completed successfully!"
    exit 0
else
    echo "Migration failed!"
    exit 1
fi