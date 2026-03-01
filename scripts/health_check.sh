#!/bin/bash

# ============================================
# VPS Health Check — All Applications
# Checks: shridharrao.com + mitaanexpress.com
# Location: /var/www/health.sh
# Run on VPS: bash /var/www/health.sh
# ============================================

# ── Colors ──
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
BOLD='\033[1m'
DIM='\033[2m'
NC='\033[0m'

PASS=0
FAIL=0
WARN=0

pass()  { echo -e "  ${GREEN}✅ $1${NC}"; ((PASS++)); }
fail()  { echo -e "  ${RED}❌ $1${NC}"; ((FAIL++)); }
warn()  { echo -e "  ${YELLOW}⚠️  $1${NC}"; ((WARN++)); }
info()  { echo -e "  ${DIM}ℹ️  $1${NC}"; }
header(){ echo -e "\n${CYAN}${BOLD}── $1 ──${NC}"; }

echo ""
echo -e "${BOLD}═══════════════════════════════════════════════${NC}"
echo -e "${BOLD}   🏥 VPS HEALTH CHECK — $(date '+%Y-%m-%d %H:%M:%S')${NC}"
echo -e "${BOLD}═══════════════════════════════════════════════${NC}"

# ──────────────────────────────────────────
# 1. SYSTEM RESOURCES
# ──────────────────────────────────────────
header "SYSTEM RESOURCES"

# Disk usage
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | tr -d '%')
DISK_TOTAL=$(df -h / | awk 'NR==2 {print $2}')
DISK_AVAIL=$(df -h / | awk 'NR==2 {print $4}')
if [ "$DISK_USAGE" -lt 80 ]; then
    pass "Disk: ${DISK_USAGE}% used (${DISK_AVAIL} free of ${DISK_TOTAL})"
elif [ "$DISK_USAGE" -lt 90 ]; then
    warn "Disk: ${DISK_USAGE}% used (${DISK_AVAIL} free) — getting full"
else
    fail "Disk: ${DISK_USAGE}% used (${DISK_AVAIL} free) — CRITICAL!"
fi

# Memory
MEM_TOTAL=$(free -m | awk '/Mem:/ {print $2}')
MEM_USED=$(free -m | awk '/Mem:/ {print $3}')
MEM_AVAIL=$(free -m | awk '/Mem:/ {print $7}')
MEM_PCT=$((MEM_USED * 100 / MEM_TOTAL))
if [ "$MEM_PCT" -lt 80 ]; then
    pass "Memory: ${MEM_PCT}% used (${MEM_AVAIL}MB available of ${MEM_TOTAL}MB)"
elif [ "$MEM_PCT" -lt 90 ]; then
    warn "Memory: ${MEM_PCT}% used (${MEM_AVAIL}MB available) — high usage"
else
    fail "Memory: ${MEM_PCT}% used (${MEM_AVAIL}MB available) — CRITICAL!"
fi

# CPU load
LOAD_1=$(cat /proc/loadavg | awk '{print $1}')
CPU_CORES=$(nproc)
LOAD_INT=$(echo "$LOAD_1" | cut -d. -f1)
if [ "$LOAD_INT" -lt "$CPU_CORES" ]; then
    pass "CPU Load: ${LOAD_1} (${CPU_CORES} cores)"
else
    warn "CPU Load: ${LOAD_1} (${CPU_CORES} cores) — high load"
fi

# Uptime
UPTIME=$(uptime -p 2>/dev/null || uptime | sed 's/.*up/up/')
info "Uptime: $UPTIME"

# ──────────────────────────────────────────
# 2. CORE SERVICES
# ──────────────────────────────────────────
header "CORE SERVICES"

# Nginx
if systemctl is-active --quiet nginx; then
    pass "Nginx: active"
else
    fail "Nginx: DOWN"
fi

# PostgreSQL
if systemctl is-active --quiet postgresql; then
    pass "PostgreSQL: active"
    # Test connection
    if sudo -u postgres psql -c "SELECT 1;" &>/dev/null; then
        pass "PostgreSQL: accepting connections"
    else
        fail "PostgreSQL: NOT accepting connections"
    fi
else
    fail "PostgreSQL: DOWN"
fi

# Redis
if systemctl is-active --quiet redis-server; then
    pass "Redis: active"
    if redis-cli ping &>/dev/null; then
        pass "Redis: responding to PING"
    else
        fail "Redis: NOT responding to PING"
    fi
else
    fail "Redis: DOWN"
fi

# ──────────────────────────────────────────
# 3. SHRIDHAR RAO (Go backend on :8080)
# ──────────────────────────────────────────
header "SHRIDHAR RAO (shridharrao.com)"

# Backend systemd service
if systemctl is-active --quiet shridharrao-backend; then
    pass "Backend service: active"
else
    fail "Backend service: DOWN"
    RECENT_LOG=$(journalctl -u shridharrao-backend --no-pager -n 5 2>/dev/null | tail -3)
    if [ -n "$RECENT_LOG" ]; then
        info "Recent logs:"
        echo -e "    ${DIM}${RECENT_LOG}${NC}"
    fi
fi

# Backend API on localhost
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 http://localhost:8080/articles 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    pass "Backend API (localhost:8080): HTTP $HTTP_CODE"
else
    fail "Backend API (localhost:8080): HTTP $HTTP_CODE"
fi

# Backend API via domain
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 https://api.shridharrao.com/articles 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    pass "API via domain (api.shridharrao.com): HTTP $HTTP_CODE"
elif [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    warn "API via domain: HTTP $HTTP_CODE (redirect)"
elif [ "$HTTP_CODE" = "000" ]; then
    fail "API via domain: unreachable (DNS or SSL issue)"
else
    fail "API via domain: HTTP $HTTP_CODE"
fi

# Frontend dist exists
if [ -f "/var/www/shridharrao/frontend/dist/index.html" ]; then
    DIST_SIZE=$(du -sh /var/www/shridharrao/frontend/dist/ 2>/dev/null | awk '{print $1}')
    pass "Frontend build: exists (${DIST_SIZE})"
else
    fail "Frontend build: MISSING at /var/www/shridharrao/frontend/dist/"
fi

# Frontend via domain
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 https://shridharrao.com 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    pass "Frontend (shridharrao.com): HTTP $HTTP_CODE"
elif [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    pass "Frontend (shridharrao.com): HTTP $HTTP_CODE (HTTPS redirect)"
elif [ "$HTTP_CODE" = "000" ]; then
    fail "Frontend (shridharrao.com): unreachable"
else
    fail "Frontend (shridharrao.com): HTTP $HTTP_CODE"
fi

# SSL certificate check
if [ -f "/etc/letsencrypt/live/shridharrao.com/fullchain.pem" ]; then
    EXPIRY=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/shridharrao.com/fullchain.pem 2>/dev/null | cut -d= -f2)
    EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null)
    NOW_EPOCH=$(date +%s)
    if [ -n "$EXPIRY_EPOCH" ]; then
        DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))
        if [ "$DAYS_LEFT" -gt 14 ]; then
            pass "SSL cert: valid, expires in ${DAYS_LEFT} days ($EXPIRY)"
        elif [ "$DAYS_LEFT" -gt 0 ]; then
            warn "SSL cert: expires in ${DAYS_LEFT} days — renew soon!"
        else
            fail "SSL cert: EXPIRED!"
        fi
    else
        info "SSL cert: exists (could not parse expiry)"
    fi
else
    warn "SSL cert: not found at /etc/letsencrypt/live/shridharrao.com/"
fi

# ──────────────────────────────────────────
# 4. MITAAN EXPRESS (Node.js backend on :4000)
# ──────────────────────────────────────────
header "MITAAN EXPRESS (mitaanexpress.com)"

# Check if PM2 is managing or if systemd is used
MITAAN_RUNNING=false

# Check PM2 first
if command -v pm2 &>/dev/null; then
    PM2_STATUS=$(pm2 jlist 2>/dev/null | grep -o '"name":"mitaan-backend"' || true)
    if [ -n "$PM2_STATUS" ]; then
        PM2_ONLINE=$(pm2 jlist 2>/dev/null | python3 -c "
import sys, json
try:
    apps = json.load(sys.stdin)
    for app in apps:
        if app.get('name') == 'mitaan-backend':
            print(app.get('pm2_env', {}).get('status', 'unknown'))
except: print('unknown')
" 2>/dev/null)
        if [ "$PM2_ONLINE" = "online" ]; then
            pass "PM2 process (mitaan-backend): online"
            MITAAN_RUNNING=true
        else
            fail "PM2 process (mitaan-backend): $PM2_ONLINE"
        fi
    fi
fi

# Check systemd service as fallback
if systemctl is-active --quiet mitaan-express-backend 2>/dev/null; then
    pass "Backend service (systemd): active"
    MITAAN_RUNNING=true
elif ! $MITAAN_RUNNING; then
    # Check if port 4000 is in use at all
    if ss -tlnp | grep -q ":4000 " 2>/dev/null; then
        warn "Port 4000 is in use (process running outside PM2/systemd)"
        MITAAN_RUNNING=true
    else
        fail "Backend: NOT running (no process on port 4000)"
    fi
fi

# Backend API on localhost
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 http://localhost:4000/ 2>/dev/null)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "404" ] || [ "$HTTP_CODE" = "401" ]; then
    pass "Backend API (localhost:4000): responding (HTTP $HTTP_CODE)"
elif [ "$HTTP_CODE" = "000" ]; then
    fail "Backend API (localhost:4000): not responding"
else
    warn "Backend API (localhost:4000): HTTP $HTTP_CODE"
fi

# Backend API via domain
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 https://api.mitaanexpress.com/ 2>/dev/null)
if [ "$HTTP_CODE" = "200" ] || [ "$HTTP_CODE" = "404" ] || [ "$HTTP_CODE" = "401" ]; then
    pass "API via domain (api.mitaanexpress.com): HTTP $HTTP_CODE"
elif [ "$HTTP_CODE" = "000" ]; then
    fail "API via domain: unreachable (DNS or SSL issue)"
else
    warn "API via domain: HTTP $HTTP_CODE"
fi

# Frontend dist exists
if [ -f "/var/www/mitaan-express/frontend/dist/index.html" ]; then
    DIST_SIZE=$(du -sh /var/www/mitaan-express/frontend/dist/ 2>/dev/null | awk '{print $1}')
    pass "Frontend build: exists (${DIST_SIZE})"
else
    fail "Frontend build: MISSING at /var/www/mitaan-express/frontend/dist/"
fi

# Frontend via domain
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --connect-timeout 5 https://mitaanexpress.com 2>/dev/null)
if [ "$HTTP_CODE" = "200" ]; then
    pass "Frontend (mitaanexpress.com): HTTP $HTTP_CODE"
elif [ "$HTTP_CODE" = "301" ] || [ "$HTTP_CODE" = "302" ]; then
    pass "Frontend (mitaanexpress.com): HTTP $HTTP_CODE (HTTPS redirect)"
elif [ "$HTTP_CODE" = "000" ]; then
    fail "Frontend (mitaanexpress.com): unreachable"
else
    fail "Frontend (mitaanexpress.com): HTTP $HTTP_CODE"
fi

# SSL certificate check
if [ -f "/etc/letsencrypt/live/mitaanexpress.com-0001/fullchain.pem" ]; then
    EXPIRY=$(openssl x509 -enddate -noout -in /etc/letsencrypt/live/mitaanexpress.com-0001/fullchain.pem 2>/dev/null | cut -d= -f2)
    EXPIRY_EPOCH=$(date -d "$EXPIRY" +%s 2>/dev/null)
    NOW_EPOCH=$(date +%s)
    if [ -n "$EXPIRY_EPOCH" ]; then
        DAYS_LEFT=$(( (EXPIRY_EPOCH - NOW_EPOCH) / 86400 ))
        if [ "$DAYS_LEFT" -gt 14 ]; then
            pass "SSL cert: valid, expires in ${DAYS_LEFT} days"
        elif [ "$DAYS_LEFT" -gt 0 ]; then
            warn "SSL cert: expires in ${DAYS_LEFT} days — renew soon!"
        else
            fail "SSL cert: EXPIRED!"
        fi
    else
        info "SSL cert: exists (could not parse expiry)"
    fi
else
    # Try alternate path
    if [ -f "/etc/letsencrypt/live/mitaanexpress.com/fullchain.pem" ]; then
        pass "SSL cert: exists at alternate path"
    else
        warn "SSL cert: not found for mitaanexpress.com"
    fi
fi

# ──────────────────────────────────────────
# 5. NGINX CONFIG VALIDATION
# ──────────────────────────────────────────
header "NGINX CONFIGURATION"

if nginx -t 2>&1 | grep -q "syntax is ok"; then
    pass "Nginx config: syntax OK"
else
    fail "Nginx config: SYNTAX ERROR"
    nginx -t 2>&1 | head -5
fi

# Check enabled sites
ENABLED_SITES=$(ls /etc/nginx/sites-enabled/ 2>/dev/null | tr '\n' ', ' | sed 's/,$//')
info "Enabled sites: ${ENABLED_SITES}"

# ──────────────────────────────────────────
# 6. PORT CONFLICTS CHECK
# ──────────────────────────────────────────
header "PORT USAGE"

check_port() {
    local PORT=$1
    local EXPECTED=$2
    local PROCESS=$(ss -tlnp | grep ":${PORT} " | head -1 | grep -oP 'users:\(\("\K[^"]+' 2>/dev/null || echo "unknown")
    if ss -tlnp | grep -q ":${PORT} "; then
        if [ -n "$EXPECTED" ]; then
            pass "Port ${PORT}: in use by ${PROCESS} (expected: ${EXPECTED})"
        else
            info "Port ${PORT}: in use by ${PROCESS}"
        fi
    else
        if [ -n "$EXPECTED" ]; then
            fail "Port ${PORT}: NOT in use (expected: ${EXPECTED})"
        else
            info "Port ${PORT}: free"
        fi
    fi
}

check_port 80 "nginx"
check_port 443 "nginx"
check_port 8080 "shridharrao-backend"
check_port 4000 "mitaan-backend"
check_port 5432 "postgresql"
check_port 6379 "redis"

# ──────────────────────────────────────────
# 7. DATABASE CONNECTIVITY
# ──────────────────────────────────────────
header "DATABASE"

# Shridhar Rao DB
if sudo -u postgres psql -d shridhar_rao -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" &>/dev/null; then
    TABLE_COUNT=$(sudo -u postgres psql -t -d shridhar_rao -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
    pass "shridhar_rao DB: ${TABLE_COUNT} tables"
else
    fail "shridhar_rao DB: cannot connect"
fi

# Mitaan Express DB
if sudo -u postgres psql -d mitaanexpress -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" &>/dev/null; then
    TABLE_COUNT=$(sudo -u postgres psql -t -d mitaanexpress -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" 2>/dev/null | tr -d ' ')
    pass "mitaanexpress DB: ${TABLE_COUNT} tables"
else
    warn "mitaanexpress DB: cannot connect (might use different name)"
fi

# ──────────────────────────────────────────
# 8. RECENT ERRORS (last 30 min)
# ──────────────────────────────────────────
header "RECENT ERRORS (last 30 min)"

# Shridhar Rao backend errors
SR_ERRORS=$(journalctl -u shridharrao-backend --since "30 min ago" --no-pager 2>/dev/null | grep -ciE "error|panic|fatal" || echo "0")
if [ "$SR_ERRORS" -eq 0 ]; then
    pass "Shridhar Rao backend: no errors"
else
    warn "Shridhar Rao backend: ${SR_ERRORS} error(s) in last 30 min"
    journalctl -u shridharrao-backend --since "30 min ago" --no-pager 2>/dev/null | grep -iE "error|panic|fatal" | tail -3 | while read -r line; do
        echo -e "    ${DIM}${line}${NC}"
    done
fi

# Nginx errors
NGINX_ERRORS=$(tail -100 /var/log/nginx/error.log 2>/dev/null | awk -v d="$(date -d '30 min ago' '+%Y/%m/%d %H:%M' 2>/dev/null)" '$0 >= d' | wc -l)
if [ "$NGINX_ERRORS" -eq 0 ]; then
    pass "Nginx: no recent errors"
else
    warn "Nginx: ${NGINX_ERRORS} error(s) in log"
    tail -3 /var/log/nginx/error.log 2>/dev/null | while read -r line; do
        echo -e "    ${DIM}${line}${NC}"
    done
fi

# ──────────────────────────────────────────
# SUMMARY
# ──────────────────────────────────────────
echo ""
echo -e "${BOLD}═══════════════════════════════════════════════${NC}"
echo -e "${BOLD}   📊 SUMMARY${NC}"
echo -e "${BOLD}═══════════════════════════════════════════════${NC}"
echo ""
echo -e "  ${GREEN}✅ Passed: ${PASS}${NC}"
echo -e "  ${YELLOW}⚠️  Warnings: ${WARN}${NC}"
echo -e "  ${RED}❌ Failed: ${FAIL}${NC}"
echo ""

if [ "$FAIL" -eq 0 ] && [ "$WARN" -eq 0 ]; then
    echo -e "  ${GREEN}${BOLD}🎉 ALL SYSTEMS HEALTHY!${NC}"
elif [ "$FAIL" -eq 0 ]; then
    echo -e "  ${YELLOW}${BOLD}⚡ Systems operational with warnings.${NC}"
else
    echo -e "  ${RED}${BOLD}🚨 ${FAIL} FAILURE(S) DETECTED — action required!${NC}"
fi

echo ""
echo -e "${DIM}  Run again: bash /var/www/health.sh${NC}"
echo ""
