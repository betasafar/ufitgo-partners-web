# State Management Architecture

## Authentication & User State

This application uses a **cookie-based authentication** system with HTTP-only cookies for bank-grade security.

### Architecture Overview

\`\`\`
┌─────────────┐
│   Login     │
│   (POST)    │
└──────┬──────┘
       │
       ├─→ Store auth_token (HTTP-only, secure)
       ├─→ Store operator_data (accessible to JS, for UI)
       │
       v
┌─────────────────────────┐
│   Dashboard Layout      │
│   (Server Component)    │
└──────┬──────────────────┘
       │
       ├─→ Read operator_data from cookie FIRST
       ├─→ Fallback to API if cookie missing
       │
       v
┌─────────────────────────┐
│  Header & Sidebar       │
│  (Display User Info)    │
└─────────────────────────┘
\`\`\`

### State Management Rules

1. **Single Source of Truth: Cookies**
   - `auth_token` - HTTP-only cookie (JavaScript cannot access, maximum security)
   - `operator_data` - Regular cookie (accessible to JavaScript for UI display)

2. **No localStorage or sessionStorage for State**
   - localStorage/sessionStorage are ONLY used for:
     - Clearing on logout (security measure)
   - NEVER used to store authentication tokens or user data

3. **Data Flow**
   \`\`\`
   Login → Store in Cookie → Read from Cookie → Display in UI
   \`\`\`

4. **Consistency**
   - All components receive operator data from the server layout
   - Props are passed down from layout to header/sidebar
   - No client-side fetching of user data (prevents state mismatch)

### Security Features

- **HTTP-only cookies** - Prevents XSS attacks from stealing tokens
- **SameSite=Lax** - Prevents CSRF attacks
- **Secure flag** - Ensures cookies only sent over HTTPS in production
- **7-day expiration** - Automatic session timeout
- **No token exposure** - Tokens never accessible to JavaScript

### Why This Approach?

1. **Security First**: HTTP-only cookies cannot be accessed by malicious scripts
2. **No State Sync Issues**: Single source of truth (cookies) prevents mismatches
3. **Server-Side Rendering**: Next.js can read cookies server-side for SSR
4. **Performance**: Cookies automatically sent with every request
5. **Simplicity**: No complex client-side state management needed

### Cookie Structure

\`\`\`typescript
// Set during login
cookies.set("auth_token", access_token, {
  httpOnly: true,      // Cannot be read by JavaScript
  secure: true,        // Only sent over HTTPS
  sameSite: "lax",     // CSRF protection
  maxAge: 604800,      // 7 days
  path: "/"
})

cookies.set("operator_data", JSON.stringify(operator), {
  httpOnly: false,     // Accessible for UI rendering
  secure: true,
  sameSite: "lax",
  maxAge: 604800,
  path: "/"
})
\`\`\`

### Data Mapping

The backend returns operator data in this format:
\`\`\`json
{
  "id": 1,
  "email": "elite@travels.com",
  "companyName": "Elite Hajj Travels",
  "verificationStatus": "approved"
}
\`\`\`

This is stored in cookies and mapped to the Operator type for consistent UI display.

### Testing Without Backend

When backend is unavailable:
1. Login stores mock data in cookies
2. Dashboard reads from cookies (not API)
3. UI shows correct user information
4. No "operator@travels.com" fallback shown

This ensures the app works correctly even during backend downtime.
