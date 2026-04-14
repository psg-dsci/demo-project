# 🚀 GitHub Actions + EC2 Demo Project

A Node.js Express app with a complete CI/CD pipeline that:
- Runs tests on every push/PR
- Auto-deploys to AWS EC2 on merge to `main`

---

## 📁 Project Structure

```
demo-project/
├── .github/
│   └── workflows/
│       └── deploy.yml        ← CI/CD pipeline
├── src/
│   ├── app.js                ← Express app
│   └── app.test.js           ← Jest tests
├── scripts/
│   └── setup-ec2.sh          ← One-time EC2 setup script
├── .env.example
├── .gitignore
└── package.json
```

---

## ⚡ Quick Start (Local)

```bash
npm install
npm run dev       # starts with nodemon on port 3000
npm test          # run tests
```

Visit: http://localhost:3000

**API Endpoints:**
| Route | Description |
|-------|-------------|
| `GET /` | Welcome message + version info |
| `GET /health` | Health check |
| `GET /info` | Node.js runtime info |

---

## 🖥️ EC2 Setup (Do This Once)

### Step 1 — Launch EC2 Instance
- AMI: **Amazon Linux 2023** (or Ubuntu 22.04)
- Instance type: `t2.micro` (free tier)
- Key pair: Create/download a `.pem` file
- Security Group inbound rules:
  - SSH (port 22) — Your IP
  - Custom TCP (port 3000) — 0.0.0.0/0

### Step 2 — SSH into your EC2 and run setup script

```bash
ssh -i your-key.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

Upload and run the setup script:
```bash
# From your local machine
scp -i your-key.pem scripts/setup-ec2.sh ec2-user@YOUR_EC2_IP:~/
ssh -i your-key.pem ec2-user@YOUR_EC2_IP "bash ~/setup-ec2.sh"
```

---

## 🔐 GitHub Secrets Setup

Go to your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**

Add these 4 secrets:

| Secret Name | Value |
|-------------|-------|
| `EC2_HOST` | Your EC2 Public IP or DNS (e.g. `54.123.45.67`) |
| `EC2_USER` | `ec2-user` (Amazon Linux) or `ubuntu` (Ubuntu) |
| `EC2_SSH_KEY` | Full contents of your `.pem` private key file |
| `REPO_URL` | `https://github.com/YOUR_USERNAME/YOUR_REPO.git` |

### How to get EC2_SSH_KEY:
```bash
cat your-key.pem
# Copy everything including -----BEGIN RSA PRIVATE KEY----- lines
```

---

## 🔄 CI/CD Pipeline Flow

```
Push to main
     │
     ▼
[Job 1: Test]
  - Checkout code
  - Setup Node.js 20
  - npm ci
  - npm test
     │
     ▼ (only if tests pass)
[Job 2: Deploy]
  - SSH into EC2
  - git pull latest code
  - npm ci --omit=dev
  - pm2 restart app
```

**Pull Requests** → Only runs tests (no deploy)  
**Push to main** → Runs tests, then deploys if tests pass

---

## 🛠️ Customization

**Change Node version:** Edit `node-version` in `deploy.yml`

**Change port:** Edit `PORT` in `.env.example` and update the PM2 start command

**Ubuntu instead of Amazon Linux:**
- Change `ec2-user` to `ubuntu` in `EC2_USER` secret
- In `setup-ec2.sh`, replace `yum` with `apt-get`

**Add Slack notifications:** Add this step to the deploy job:
```yaml
- name: Slack Notify
  uses: rtCamp/action-slack-notify@v2
  env:
    SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
    SLACK_MESSAGE: "Deployed to EC2 ✅"
```

---

## 🐛 Troubleshooting

**SSH permission denied:**
```bash
chmod 400 your-key.pem
```

**PM2 not found on EC2:**
```bash
sudo npm install -g pm2
```

**App not accessible on port 3000:**
- Check EC2 Security Group has port 3000 open
- Verify PM2 is running: `pm2 list`
- Check logs: `pm2 logs app`
