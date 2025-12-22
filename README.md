# HURDS Monitoring App

A real-time monitoring application for WhatsApp Business messaging with Supabase integration.

## Features

- 📱 Real-time message monitoring from Supabase database
- 💬 WhatsApp Business API integration
- 🤖 Auto-respond toggle functionality
- 📋 Message template support with dynamic forms
- 🎨 Modern UI with blue theme (ShadCN-inspired)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials
   - Add your WhatsApp Business API credentials

3. Start the development server:
   ```bash
   npm run dev
   ```

## Environment Variables

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_WHATSAPP_ACCESS_TOKEN`: WhatsApp Business API access token
- `VITE_WHATSAPP_PHONE_NUMBER_ID`: Your WhatsApp phone number ID
- `VITE_WHATSAPP_BUSINESS_ACCOUNT_ID`: Your WhatsApp Business Account ID
- `VITE_WHATSAPP_API_VERSION`: API version (default: v21.0)

## Database Schema

The app expects the following Supabase tables:

### messages
- id (uuid, primary key)
- created_at (timestamp)
- message (text)
- sender_id (text)
- next_message_id (text)
- current_message_id (text)

### autoresponse
- id (bigint, primary key)
- last_updated (timestamp)
- user (text)
- autorespond (boolean)

## Tech Stack

- React 18
- Vite
- Tailwind CSS
- Supabase (real-time subscriptions)
- WhatsApp Business Cloud API
- Lucide React (icons)
