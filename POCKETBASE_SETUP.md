# PocketBase Setup Instructions

## 1. Download and Install PocketBase

1. Download PocketBase from: https://pocketbase.io/docs/
2. Extract the executable to your project directory
3. Make it executable (Linux/Mac): `chmod +x pocketbase`

## 2. Initialize PocketBase

```bash
# Start PocketBase (from project root)
./pocketbase serve

# Or on Windows
pocketbase.exe serve
```

- PocketBase will start on http://127.0.0.1:8090
- First time: Go to http://127.0.0.1:8090/_/ to create admin account

## 3. Create Collections

### Create these collections in PocketBase Admin UI:

#### 1. `employees` Collection
```
Type: Base
Fields:
- id (Text, Primary) - Clerk user ID
- email (Email, Required)
- name (Text, Required)
- employee_id (Text, Required, Unique)
- department (Text, Default: "General")
- hire_date (Date, Required)
- role (Select: employee, admin, Default: employee)
- status (Select: active, inactive, pending, Default: active)
- points_balance (Number, Default: 0)
- total_points_earned (Number, Default: 0)
- current_streak (Number, Default: 0)
- longest_streak (Number, Default: 0)
```

#### 2. `check_ins` Collection
```
Type: Base
Fields:
- user_id (Relation to employees, Required)
- check_in_time (DateTime, Required)
- points_earned (Number, Required)
- check_in_type (Select: early, ontime, late, Required)
- location (Text, Optional)
- streak_day (Number, Default: 1)
```

#### 3. `rewards` Collection
```
Type: Base
Fields:
- name (Text, Required)
- description (Text, Required)
- category (Select: weekly, monthly, quarterly, annual, special, Required)
- points_cost (Number, Required)
- quantity_available (Number, Default: -1) # -1 = unlimited
- is_active (Bool, Default: true)
- image_url (URL, Optional)
- terms (Text, Optional)
```

#### 4. `redemptions` Collection
```
Type: Base
Fields:
- user_id (Relation to employees, Required)
- reward_id (Relation to rewards, Required)
- points_spent (Number, Required)
- status (Select: pending, approved, rejected, fulfilled, Default: pending)
- requested_date (DateTime, Required)
- processed_date (DateTime, Optional)
- processed_by (Relation to employees, Optional)
- rejection_reason (Text, Optional)
- fulfillment_notes (Text, Optional)
```

#### 5. `badges` Collection
```
Type: Base
Fields:
- name (Text, Required)
- description (Text, Required)
- icon (Text, Required) # Emoji or icon class
- criteria_type (Select: streak, points, checkins, special, Required)
- criteria_value (Number, Required)
- is_active (Bool, Default: true)
```

#### 6. `user_badges` Collection
```
Type: Base
Fields:
- user_id (Relation to employees, Required)
- badge_id (Relation to badges, Required)
- earned_date (DateTime, Required)
```

#### 7. `motivational_quotes` Collection
```
Type: Base
Fields:
- quote_text (Text, Required)
- author (Text, Optional)
- category (Select: motivation, success, teamwork, general, Default: general)
- is_active (Bool, Default: true)
```

#### 8. `system_settings` Collection
```
Type: Base
Fields:
- setting_key (Text, Required, Unique)
- setting_value (Text, Required)
- description (Text, Required)
- category (Select: points, timing, general, company, Default: general)
```

#### 9. `point_transactions` Collection
```
Type: Base
Fields:
- user_id (Relation to employees, Required)
- transaction_type (Select: earned, spent, adjusted, refunded, Required)
- points_amount (Number, Required) # Can be negative
- reference_type (Select: checkin, redemption, admin_adjustment, bonus, Required)
- reference_id (Text, Required) # ID of related record
- description (Text, Required)
- created_by (Relation to employees, Optional) # For admin adjustments
```

## 4. API Rules & Permissions

### Recommended settings for each collection:

#### `employees`
- List: `@request.auth.id != ""`
- View: `@request.auth.id != ""`
- Create: `@request.auth.id != ""`
- Update: `id = @request.auth.id || @request.auth.role = "admin"`
- Delete: `@request.auth.role = "admin"`

#### Other collections
- Generally allow authenticated users to read
- Restrict create/update/delete based on business logic
- Admin role should have full access

## 5. Environment Variables

Create `.env` file in frontend directory:
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key
VITE_POCKETBASE_URL=http://127.0.0.1:8090
```

## 6. Seed Initial Data

After creating collections, you can manually add:
- Initial rewards from `src/data/seeds.ts`
- System settings for point values
- Initial badges
- Motivational quotes

## 7. Production Deployment

For production:
1. Deploy PocketBase to a server (VPS, Docker, etc.)
2. Update `VITE_POCKETBASE_URL` to your production URL
3. Set up proper SSL certificates
4. Configure backups for the SQLite database

## Testing the Setup

1. Start PocketBase: `./pocketbase serve`
2. Create collections via admin UI
3. Start the React app: `npm run dev`
4. Login with Clerk - should create employee record in PocketBase
5. Try check-in functionality - should store data in PocketBase