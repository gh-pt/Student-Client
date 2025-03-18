#!/bin/bash

# Get the machine's local network IP
IP_ADDRESS=$(hostname -I | awk '{print $1}')

# Check if an IP was found
if [ -z "$IP_ADDRESS" ]; then
    echo "Could not determine IP address."
    exit 1
fi

# Update frontend (Vite) .env
echo "VITE_HOST_URL=http://$IP_ADDRESS:3000" > .env

echo "✅ Frontend API URL set to $IP_ADDRESS in .env"
