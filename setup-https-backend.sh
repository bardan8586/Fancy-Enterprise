#!/bin/bash

# HTTPS Setup Script for EC2 Backend
# This script sets up SSL certificate using Let's Encrypt

echo "🔒 HTTPS Setup for Backend API"
echo "================================"
echo ""

# Check if running on EC2
if [ ! -f /etc/os-release ]; then
    echo "❌ This script should be run on your EC2 instance"
    exit 1
fi

# Install certbot
echo "📦 Installing certbot..."
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx

echo ""
echo "✅ Certbot installed!"
echo ""
echo "📝 Next steps:"
echo "1. Make sure your domain points to this EC2 IP: 54.252.251.170"
echo "2. Run: sudo certbot --nginx -d yourdomain.com"
echo "3. Follow the prompts"
echo ""
echo "After SSL is set up, update your frontend .env with:"
echo "VITE_BACKEND_URL=https://yourdomain.com"



