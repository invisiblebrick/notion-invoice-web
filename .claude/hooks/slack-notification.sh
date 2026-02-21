#!/bin/bash

# Slack Webhook Notification Script with Context
# Usage: ./slack-notification.sh "message"

# Load environment variables
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../../.env"

# 기본 메시지
MESSAGE="${1:-🔔 알림}"

# # Hook 컨텍스트 정보 수집
# HOOK_TYPE="${CLAUDE_HOOK_TYPE:-알 수 없음}"
# TOOL_NAME="${CLAUDE_TOOL_NAME:-없음}"
# SESSION_ID="${CLAUDE_SESSION_ID:-없음}"

# # 현재 시간
# TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

# Slack 메시지 구성 (Block Kit 사용)
JSON_PAYLOAD=$(cat <<EOF
{
  "blocks": [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "$MESSAGE"
      }
    },
    {
      "type": "section",
      "fields": [
        {
          "type": "mrkdwn",
          "text": "Notification"
        }
      ]
    }
  ]
}
EOF
)

# Send notification to Slack
curl -X POST \
  -H 'Content-type: application/json' \
  --data "$JSON_PAYLOAD" \
  "$SLACK_WEBHOOK_URL" \
  2>/tmp/slack_hook_error.log

exit 0
