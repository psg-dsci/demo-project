#!/bin/bash
# ─────────────────────────────────────────────────────────────
# EC2 Setup Script — Run this ONCE on your EC2 instance
# Works for Amazon Linux 2023 / Amazon Linux 2
# For Ubuntu: replace "yum" with "apt-get" and "amazon-linux-extras" steps
# ─────────────────────────────────────────────────────────────

set -e  # Exit on any error

echo "🔧 Updating system packages..."
sudo yum update -y

echo "📦 Installing Node.js 20..."
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo yum install -y nodejs

echo "📦 Installing Git..."
sudo yum install -y git

echo "📦 Installing PM2 globally..."
sudo npm install -g pm2

echo "⚙️  Setting up PM2 to start on reboot..."
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u ec2-user --hp /home/ec2-user

echo "📁 Creating app directory..."
mkdir -p /home/ec2-user/app/logs

echo "🔥 Configuring firewall — opening port 3000..."
sudo firewall-cmd --permanent --add-port=3000/tcp 2>/dev/null || true
sudo firewall-cmd --reload 2>/dev/null || true

echo ""
echo "✅ EC2 setup complete!"
echo ""
echo "👉 NEXT STEPS:"
echo "  1. Add these GitHub Secrets to your repo:"
echo "     EC2_HOST     → your EC2 public IP or DNS"
echo "     EC2_USER     → ec2-user  (or ubuntu for Ubuntu AMIs)"
echo "     EC2_SSH_KEY  → contents of your .pem private key"
echo "     REPO_URL     → https://github.com/YOUR_USERNAME/YOUR_REPO.git"
echo ""
echo "  2. Open port 3000 in your EC2 Security Group (inbound rule)"
echo "  3. Push to the 'main' branch to trigger deployment"
