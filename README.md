# Connekz Agent

![Connekz Logo](https://storage.connekz.com/common/logos/full-logo-420.webp)

Human-like AI agent for seamless integration into websites, apps, and automations. This npm package allows developers to embed the Connekz agent as a customer assistant, task runner, and more.

## Introduction

Connekz Agent is part of the Connekz developer toolkit, enabling AI-driven interactions in your projects. It supports natural conversations, built-in tools for tasks like bookings and website navigation, and easy integration via npm.

- **Key Capabilities**:
  - Customer support via chat or voice-like interactions.
  - Task automation: Handle bookings, navigate sites, run custom actions.
  - Compatible with web, mobile, and backend setups.
  - Stateful memory for personalized, context-aware responses.
  - Realtime voice and text interfaces with transcription support.
  - Tool calls for extending functionality (e.g., navigation, API integrations).

## Installation

Install via npm:

```bash
npm install @connekz/connekz-agent
```

## Usage
Import and initialize the agent in your Vue.js project (compatible with Vue 3). The package provides headless APIs for socket and agent management, plus mountable components for UI elements.

## Initialization Example

```typescript
import init, { type ConnekzInstance, type ConnekzAgentStatus, type ConnekzToolCallPayload } from '@connekz/connekz-agent';

const connekzInstance: ConnekzInstance = init({
  clientId: 'your-client-id', // Required
  clientSecret: 'your-client-secret', // Required
  userIdentity: 'optional-user-id', // (optional: Will be generated if not provided. This helps to identify users across multiple sessions.)
  aiSphere: { // Optional: Mount AI visualization sphere
    mountElementId: 'ai-sphere-container',
    themeColor: '#your-color', // Hex color code
  },
  transcription: { // Optional: Mount transcription display
    mountElementId: 'transcript-container',
  },
  chatWindow: { // Optional: Mount full chat window
    mountElementId: 'chat-window-container',
    disableTalkMode: false, // Optional
    disableChatMode: false, // Optional
  },
  connekzControls: { // Optional: Mount AI controls UI
    mountElementId: 'controls-container',
  },
});

// Access APIs
const { connekzSocket, connekzAgent, unmount } = connekzInstance;
```

### Unmounting Call
```typescript
connekzInstance.unmount()
```
to clean up resources and unmount components.

## Agent Management
- Start/Stop Agent:
  ````typescript
  connekzAgent.startAgent(); // Initiates voice agent
  connekzAgent.stopAgent(); // Stops and cleans up
  ````
- Manually Inject Text Message:
  ````typescript
  connekzAgent.injectMessage('User query text');
  ````
- Toggle Microphone
  ````typescript
  connekzAgent.toggleMic();
  ````
- Testing Helpers (for development):
  ````typescript
  connekzAgent.startCaptureTest(); // Start audio capture test
  connekzAgent.stopCaptureTest(); // Stop audio capture test
  connekzAgent.playCapturedAudio(); // Playback captured audio test
  ````
- Conversation History:
  ````typescript
  // Full conversation for the current thread — both voice AND text turns,
  // seeded from server history and kept live. Chronological snapshot.
  const history = connekzAgent.getConversation();
  // -> ConnekzConversationMessage[]: { id?, role: 'user' | 'ai' | 'system', message, at }[]

  // Current chat thread id (null before a thread is established).
  const threadId = connekzAgent.getThreadId();
  ````
  Typical use — capture the transcript when a tool fires (e.g. a booking) and
  forward it to your own backend:
  ````typescript
  connekzAgent.subscribe.onToolCall(async (tool) => {
    if (tool.name === 'book_meeting') {
      const transcript = connekzAgent.getConversation();
      const threadId = connekzAgent.getThreadId();
      await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ booking: tool.arguments, threadId, transcript }),
      });
      return 'Booking captured';
    }
    return 'Unknown tool';
  });
  ````

## Subscriptions
Subscribe to events for realtime updates:
````typescript
// Agent Subscriptions
const unsubStatus = connekzAgent.subscribe.onAgentStatusChange((status: ConnekzAgentStatus) => {
  console.log('Agent status:', status);
});

const unsubMic = connekzAgent.subscribe.onMicStatusChange((status: 'active' | 'muted') => {
  console.log('Mic status:', status);
});

const unsubUserWave = connekzAgent.subscribe.onUserWaveformUpdate((volume: number) => {
  console.log('User volume:', volume);
});

const unsubAgentWave = connekzAgent.subscribe.onAgentWaveformUpdate((volume: number) => {
  console.log('Agent volume:', volume);
});

const unsubTranscript = connekzAgent.subscribe.onTranscriptUpdate((transcript: readonly ConnekzTranscript[]) => {
  console.log('Transcript:', transcript);
});

// Tool Call Handling
const unsubTool = connekzAgent.subscribe.onToolCall(async (tool: ConnekzToolCallPayload): Promise<string> => {
  console.log('Tool call:', tool.name, tool.arguments);
  // Execute tool logic
  if (tool.name === 'your-tool') {
    // Process arguments and return result as string
    return 'Success: Action completed.';
  }
  return 'Error: Unknown tool.';
});

// Unsubscribe when done
unsubStatus();
unsubTool(); // etc.
````

## Socket Management
Socket is automatically managed with agent start/stop. The following methods available for manual control:
````typescript
connekzSocket.connect(); // Force optional
connekzSocket.disconnect();
connekzSocket.cleanup(); // Remove listeners
````

## Integration Tips
- Frontend Embedding: Mount built-in UI or use headless APIs to integrate into existing apps.
- Backend/Automations: Use headless APIs for server-side task running or integrations.
- Custom Tools: Subscribe to onToolCall for handling AI-triggered actions (e.g., site navigation, API calls). Ensure the tools are defined in the connekz instance Memory & Tools section on the developer portal.
- Error Handling: Monitor agent status for 'ERROR' or 'DISCONNECTED' and also your app console logs.
- Privacy/Security: Provide clientId/secret securely; userIdentity for isolated sessions.

## Examples
### Basic Voice Agent on a React website
```jsx
import React, { useEffect, useState } from 'react';
import init from '@connekz/connekz-agent';

function App() {
  const [instance, setInstance] = useState(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const connekz = init({
      clientId: 'your-client-id',
      clientSecret: 'your-client-secret',
      chatWindow: { mountElementId: 'chat-window-container' }, // This will mount a full chat window (optional)
      // Mount Modules
      // aiSphere: { mountElementId: 'ai-sphere-container' }, // This will mount the AI visualization sphere (optional)
      // transcription: { mountElementId: 'transcript-container' }, // This will mount the transcription display (optional)
    });
    setInstance(connekz);

    const unsubStatus = connekz.connekzAgent.subscribe.onAgentStatusChange((status) => {
      setIsActive(status !== 'STOPPED');
    });

    const unsubTool = connekz.connekzAgent.subscribe.onToolCall(async (tool) => {
      console.log('Tool call:', tool);
      // Handle tool logic
      return 'Result string';
    });

    return () => {
      unsubStatus();
      unsubTool();
      connekz.unmount();
    };
  }, []);

  const toggleAgent = () => {
    if (isActive) {
      instance.connekzAgent.stopAgent();
    } else {
      instance.connekzAgent.startAgent();
    }
  };

  return (
          <div>
            <div id="chat-window-container"></div>
            {/*<div id="ai-sphere-container"></div>*/}
            {/*<div id="transcript-container"></div>*/}
            <button onClick={toggleAgent}>
              {isActive ? 'Stop' : 'Start'} Agent
            </button>
          </div>
  );
}

export default App;
```

### Basic Voice Agent on a Vue Website
```vue
<template>
  <div>
    <div id="chat-window-container"></div>
<!--    <div id="ai-sphere-container"></div>-->
<!--    <div id="transcript-container"></div>-->
    <button @click="toggleAgent">{{ isActive ? 'Stop' : 'Start' }} Agent</button>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import init from '@connekz/connekz-agent';

const instance = ref(null);
const isActive = ref(false);

onMounted(() => {
  instance.value = init({
    clientId: 'your-client-id',
    clientSecret: 'your-client-secret',
    chatWindow: { mountElementId: 'chat-window-container' }, // This will mount a full chat window (optional)
    // Mount Modules
    // aiSphere: { mountElementId: 'ai-sphere-container' }, // This will mount the AI visualization sphere (optional)
    // transcription: { mountElementId: 'transcript-container' }, // This will mount the transcription display (optional)
  });
  instance.value.connekzAgent.subscribe.onAgentStatusChange(status => {
    isActive.value = status !== 'STOPPED';
  });
  instance.value.connekzAgent.subscribe.onToolCall(async tool => {
    // Handle tool
    return 'Result';
  });
});

const toggleAgent = () => {
  if (isActive.value) {
    instance.value.connekzAgent.stopAgent();
  } else {
    instance.value.connekzAgent.startAgent();
  }
};
</script>
```

### Plain JavaScript Example
```javascript
// Initialize in a script tag or main.js
import init from '@connekz/connekz-agent';

const connekzInstance = init({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  chatWindow: { mountElementId: 'chat-window-container' }, // This will mount a full chat window (optional)
  // Mount Modules
  // aiSphere: { mountElementId: 'ai-sphere-container' }, // This will mount the AI visualization sphere (optional)
  // transcription: { mountElementId: 'transcript-container' }, // This will mount the transcription display (optional)
});

// Subscriptions
const unsubStatus = connekzInstance.connekzAgent.subscribe.onAgentStatusChange((status) => {
  console.log('Agent status:', status);
  // Update UI, e.g., button text
  const button = document.getElementById('toggle-button');
  button.textContent = status !== 'STOPPED' ? 'Stop Agent' : 'Start Agent';
});

const unsubTool = connekzInstance.connekzAgent.subscribe.onToolCall(async (tool) => {
  console.log('Tool call:', tool);
  // Handle tool logic
  return 'Result string';
});

// Toggle agent on button click
document.getElementById('toggle-button').addEventListener('click', () => {
  const isActive = connekzInstance.connekzAgent.subscribe.onAgentStatusChange(); // Get current status if needed
  if (isActive !== 'STOPPED') {
    connekzInstance.connekzAgent.stopAgent();
  } else {
    connekzInstance.connekzAgent.startAgent();
  }
});

// Cleanup on unload
window.addEventListener('beforeunload', () => {
  unsubStatus();
  unsubTool();
  connekzInstance.unmount();
});
```
```html
<!-- HTML Structure -->
<div id="chat-window-container"></div>
<!--<div id="ai-sphere-container"></div>-->
<!--<div id="transcript-container"></div>-->
<button id="toggle-button">Start Agent</button>
```


### Tool Call Payload:
````typescript
{
  name: string;
  arguments: Record<string, any>;
}
````

### Tool Call Handler Example
````typescript
connekzInstance.value.connekzAgent.subscribe.onToolCall(handleToolCall);

const acceptedPaths = ['/home', '/about', '/contact'];
async function handleToolCall(tool: ConnekzToolCallPayload): Promise<string> {
  switch (tool.name) {
    case 'navigate_to': {
      const path = (tool.arguments)?.path || null;
      if (path && acceptedPaths.includes(path)) {
        router.push(path);
        return `Navigation Success. Now user on ${path}.`;
      } else {
        return !path ? 'Navigation Error: Destination path parameter must be provided to navigate.' : `Navigation Error: Path must be one of the following enums ${acceptedPaths.join(', ')}`
      }
    }
    default:
      return 'Error: Unknown tool name.';
  }
}
````

### Tool Call Response:
Always return a string (plain text or JSON.stringify for structured data).

---

## On-Demand Tools & Memories (v1.5.0+)

By default, tools and memories are loaded automatically via semantic search based on conversation context. With **on-demand loading**, you can explicitly control which tools and memories are available in a session.

### Setup

1. In the Connekz developer portal, create a tool or memory and set **Load Mode** to `On-Demand`.
2. Assign a unique **Slug** (e.g., `navigate-dashboard`, `onboarding-context`).
3. From your app, call `setSessionTools()` with an array of slugs to load.

### Usage

```typescript
// Load specific tools and memories into the active session
connekzInstance.connekzAgent.setSessionTools([
  'navigate-to-page',
  'fill-form-field',
  'onboarding-welcome-context',
]);

// Replace with a different set (previous on-demand items are removed)
connekzInstance.connekzAgent.setSessionTools([
  'dashboard-tools',
  'search-products',
]);

// Clear all on-demand tools/memories
connekzInstance.connekzAgent.setSessionTools([]);
```

### How It Works

- **Auto tools/memories** (default): Loaded via semantic search every conversation turn. Best for general-purpose knowledge.
- **On-demand tools/memories**: Only loaded when your app explicitly requests them by slug. Not included in semantic search results.
- Both types run in parallel — auto and on-demand items are merged in the active session.
- Calling `setSessionTools()` again replaces the previous on-demand set.
- Max 30 slugs per call.

### Server Confirmation

The server emits a `session-tools-updated` event (via `cnkz-voice-agent` channel) with:
```json
{ "type": "session-tools-updated", "data": { "tools": ["tool-name-1"], "memories": 2 } }
```

---

## Developer API: Usage Tracking

### Get Total Token Usage

Retrieve aggregated token usage for your instance within a date range (max 1 month).

```
GET /api/v1/developer/usage/total
```

**Headers:**
```
Authorization: Bearer <your-secret-key>
X-Client-Id: <your-client-id>
```

**Query Parameters:**
| Param | Required | Description |
|-------|----------|-------------|
| `startDate` | Yes | ISO 8601 date (e.g., `2026-04-01`) |
| `endDate` | Yes | ISO 8601 date (e.g., `2026-04-30`) |
| `userIdentity` | No | Filter by guest user identity |

**Response:**
```json
{
  "totalConnekzTokens": 142.5,
  "sessionCount": 47,
  "periodStart": "2026-04-01",
  "periodEnd": "2026-04-30"
}
```

**With userIdentity filter:**
```json
{
  "totalConnekzTokens": 12.3,
  "sessionCount": 5,
  "periodStart": "2026-04-01",
  "periodEnd": "2026-04-30",
  "userIdentity": "user-abc-123"
}
```

### User Identity Tracking

When initializing the agent with `userIdentity`, all token usage is tagged with that identity:

```typescript
const instance = init({
  clientId: 'your-client-id',
  clientSecret: 'your-secret',
  userIdentity: 'user-abc-123',  // Tagged on all usage records
});
```

This allows per-user usage tracking on shared instances (e.g., onboarding flows where multiple users share one instance).

