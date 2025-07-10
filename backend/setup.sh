#!/bin/bash

echo "🚀 Setting up System Kleen Employee Rewards database..."

# Admin credentials
ADMIN_EMAIL="Andy@vimly.ai"
ADMIN_PASSWORD="Systemkleen!"

# Login and get token
echo "Authenticating admin..."
AUTH_RESPONSE=$(curl -s -X POST "http://localhost:8090/api/admins/auth-with-password" \
  -H "Content-Type: application/json" \
  -d "{\"identity\":\"$ADMIN_EMAIL\",\"password\":\"$ADMIN_PASSWORD\"}")

if [[ $AUTH_RESPONSE == *"token"* ]]; then
  TOKEN=$(echo $AUTH_RESPONSE | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
  echo "✓ Admin authenticated"
else
  echo "❌ Authentication failed. Response: $AUTH_RESPONSE"
  exit 1
fi

# Create Companies collection
echo "Creating companies collection..."
COMPANIES_RESPONSE=$(curl -s -X POST "http://localhost:8090/api/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "companies",
    "type": "base",
    "schema": [
      {
        "name": "name",
        "type": "text",
        "required": true,
        "unique": true
      },
      {
        "name": "settings",
        "type": "json",
        "required": false
      }
    ]
  }')

if [[ $COMPANIES_RESPONSE == *"id"* ]]; then
  echo "✓ Companies collection created"
else
  echo "❌ Failed to create companies collection: $COMPANIES_RESPONSE"
fi

# Update Users collection
echo "Updating users collection..."
USERS_RESPONSE=$(curl -s -X PATCH "http://localhost:8090/api/collections/users" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "schema": [
      {"name": "email", "type": "email", "required": true, "unique": true},
      {"name": "emailVisibility", "type": "bool", "required": false},
      {"name": "verified", "type": "bool", "required": false},
      {"name": "name", "type": "text", "required": true},
      {"name": "role", "type": "select", "required": true, "options": {"maxSelect": 1, "values": ["employee", "admin", "super_admin"]}},
      {"name": "company", "type": "relation", "required": true, "options": {"collectionId": "companies", "cascadeDelete": false, "maxSelect": 1}},
      {"name": "status", "type": "select", "required": true, "options": {"maxSelect": 1, "values": ["pending", "approved", "rejected", "suspended"]}}
    ]
  }')

if [[ $USERS_RESPONSE == *"id"* ]]; then
  echo "✓ Users collection updated"
else
  echo "❌ Failed to update users collection: $USERS_RESPONSE"
fi

# Create CheckIns collection
echo "Creating checkIns collection..."
CHECKINS_RESPONSE=$(curl -s -X POST "http://localhost:8090/api/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "checkIns",
    "type": "base",
    "schema": [
      {
        "name": "user",
        "type": "relation",
        "required": true,
        "options": {
          "collectionId": "users",
          "cascadeDelete": true,
          "maxSelect": 1
        }
      },
      {
        "name": "checkInTime",
        "type": "date",
        "required": true
      },
      {
        "name": "type",
        "type": "select",
        "required": true,
        "options": {
          "maxSelect": 1,
          "values": ["early", "ontime", "late"]
        }
      },
      {
        "name": "pointsEarned",
        "type": "number",
        "required": true
      },
      {
        "name": "qrCodeData",
        "type": "text",
        "required": true
      }
    ]
  }')

if [[ $CHECKINS_RESPONSE == *"id"* ]]; then
  echo "✓ CheckIns collection created"
else
  echo "❌ Failed to create checkIns collection: $CHECKINS_RESPONSE"
fi

# Create System Kleen company
echo "Creating System Kleen company..."
COMPANY_RESPONSE=$(curl -s -X POST "http://localhost:8090/api/collections/companies/records" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "System Kleen",
    "settings": {
      "checkInWindow": {
        "start": "06:00",
        "end": "09:00",
        "timezone": "America/Denver"
      },
      "pointsConfig": {
        "early": 2,
        "onTime": 1,
        "late": 0
      }
    }
  }')

if [[ $COMPANY_RESPONSE == *"id"* ]]; then
  COMPANY_ID=$(echo $COMPANY_RESPONSE | grep -o '"id":"[^"]*"' | cut -d'"' -f4)
  echo "✓ System Kleen company created (ID: $COMPANY_ID)"
else
  echo "❌ Failed to create company: $COMPANY_RESPONSE"
fi

echo ""
echo "🎉 Setup complete for System Kleen Employee Rewards!"
echo ""
echo "Company ID: $COMPANY_ID"
echo ""
echo "Next steps:"
echo "1. Visit http://localhost:5173 to access the Employee Rewards app"
echo "2. Employees can sign up and request approval"
echo "3. Admin can approve employees through PocketBase admin panel"