# Supabase Setup Guide for Real-Time Messages

This guide will walk you through setting up Supabase for real-time messaging in the Karigar platform.

## 1. Create a Supabase Account

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project
   - Enter your project name (e.g., "karigar-app")
   - Set a strong database password (save this!)
   - Choose a region closest to your users
   - Wait for the project to be provisioned (~2 minutes)

## 2. Database Setup

### Create the Messages Table

Go to the SQL Editor in your Supabase dashboard and run the following SQL:

```sql
-- Create messages table
CREATE TABLE messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id VARCHAR(255) NOT NULL,
  sender_id VARCHAR(255) NOT NULL,
  sender_type VARCHAR(50) NOT NULL, -- 'customer' or 'provider'
  receiver_id VARCHAR(255) NOT NULL,
  receiver_type VARCHAR(50) NOT NULL, -- 'customer' or 'provider'
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_messages_booking_id ON messages(booking_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies for messages
-- Policy: Users can read messages where they are sender or receiver
CREATE POLICY "Users can read their own messages"
ON messages FOR SELECT
USING (
  sender_id = current_setting('request.jwt.claims', true)::json->>'sub'
  OR receiver_id = current_setting('request.jwt.claims', true)::json->>'sub'
);

-- Policy: Users can insert messages
CREATE POLICY "Users can insert messages"
ON messages FOR INSERT
WITH CHECK (
  sender_id = current_setting('request.jwt.claims', true)::json->>'sub'
);

-- Policy: Users can update their own messages
CREATE POLICY "Users can update their own messages"
ON messages FOR UPDATE
USING (
  sender_id = current_setting('request.jwt.claims', true)::json->>'sub'
  OR receiver_id = current_setting('request.jwt.claims', true)::json->>'sub'
);
```

### Create Conversations View (Optional but Recommended)

```sql
-- Create a view for getting conversation summaries
CREATE OR REPLACE VIEW conversation_summaries AS
SELECT DISTINCT ON (booking_id)
  booking_id,
  CASE 
    WHEN sender_id < receiver_id 
    THEN sender_id || '_' || receiver_id
    ELSE receiver_id || '_' || sender_id
  END as conversation_id,
  sender_id,
  receiver_id,
  message as last_message,
  created_at as last_message_at,
  read as last_message_read
FROM messages
ORDER BY booking_id, created_at DESC;
```

## 3. Enable Real-Time

### In Supabase Dashboard:

1. Navigate to **Database** → **Replication**
2. Find the `messages` table
3. Enable replication by toggling it ON
4. Select the events you want to track:
   - ✅ INSERT
   - ✅ UPDATE
   - ✅ DELETE

## 4. Get Your API Keys

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon/public key** (this is safe to use in your frontend)

## 5. Environment Setup

### Create/Update `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Important**: Add `.env` to your `.gitignore` file to keep your keys secure!

## 6. Install Supabase Client

Run the following command in your project directory:

```bash
npm install @supabase/supabase-js
```

## 7. Initialize Supabase Client

Create a new file `src/services/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

## 8. Real-Time Usage Examples

### Subscribe to New Messages

```typescript
import { supabase } from './services/supabase'

// Subscribe to all new messages in a specific booking
const subscription = supabase
  .channel('messages')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `booking_id=eq.${bookingId}`
    },
    (payload) => {
      console.log('New message:', payload.new)
      // Handle new message in your UI
    }
  )
  .subscribe()

// Don't forget to unsubscribe when component unmounts
// subscription.unsubscribe()
```

### Send a Message

```typescript
const sendMessage = async (messageData) => {
  const { data, error } = await supabase
    .from('messages')
    .insert([
      {
        booking_id: messageData.bookingId,
        sender_id: messageData.senderId,
        sender_type: messageData.senderType,
        receiver_id: messageData.receiverId,
        receiver_type: messageData.receiverType,
        message: messageData.message
      }
    ])
    .select()

  if (error) {
    console.error('Error sending message:', error)
    return null
  }

  return data
}
```

### Fetch Message History

```typescript
const fetchMessages = async (bookingId) => {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('booking_id', bookingId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data
}
```

### Mark Message as Read

```typescript
const markAsRead = async (messageId) => {
  const { error } = await supabase
    .from('messages')
    .update({ read: true })
    .eq('id', messageId)

  if (error) {
    console.error('Error marking message as read:', error)
  }
}
```

## 9. Security Considerations

### Authentication Integration

If you're using Supabase Auth (recommended):

1. Sign up users through Supabase:
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure-password'
})
```

2. Sign in users:
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
})
```

3. The JWT token will automatically be included in all requests

### If Using Custom Authentication

You'll need to modify the RLS policies to work with your auth system. Replace the policies with simpler ones:

```sql
-- Drop existing policies
DROP POLICY IF EXISTS "Users can read their own messages" ON messages;
DROP POLICY IF EXISTS "Users can insert messages" ON messages;
DROP POLICY IF EXISTS "Users can update their own messages" ON messages;

-- For development/testing with custom auth (less secure)
CREATE POLICY "Enable read access for all users" ON messages FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON messages FOR UPDATE USING (true);
```

⚠️ **Warning**: The above policies are for development only. In production, implement proper authentication checks.

## 10. Testing Your Setup

### Test in Supabase Dashboard:

1. Go to **Table Editor**
2. Select the `messages` table
3. Click **Insert row** and add a test message
4. Verify the message appears in the table

### Test Real-Time in Your App:

1. Open your app in two browser windows
2. Send a message from one window
3. Verify it appears instantly in the other window

## 11. Troubleshooting

### Messages not appearing in real-time?
- Check that replication is enabled for the `messages` table
- Verify your subscription is active
- Check browser console for errors
- Ensure you're subscribed to the correct channel

### Permission errors?
- Verify RLS policies are correctly set
- Check that users are authenticated
- Review the Supabase logs in the dashboard

### Can't connect to Supabase?
- Verify environment variables are correct
- Check that your project URL and anon key are valid
- Ensure your internet connection is stable

## 12. Next Steps

- [ ] Set up user authentication with Supabase Auth
- [ ] Add file upload for image sharing in messages
- [ ] Implement typing indicators
- [ ] Add push notifications for new messages
- [ ] Create admin panel for message moderation

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Real-Time Documentation](https://supabase.com/docs/guides/realtime)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)

---

**Need Help?** Check the Supabase documentation or open an issue in the project repository.
