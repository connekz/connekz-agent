export type ConnekzToolCallPayload = {
  arguments: Record<string, any>;
  name: string;
};

/**
 * Enum for voice agent statuses
 */
export type ConnekzAgentStatus =
  'NOT_STARTED' |
  'DISCONNECTED' |
  'STOPPED' |
  'INITIATING' |
  'LISTENING' |
  'SPEAKING' |
  'SLEEPING' |
  'USER_SPEAKING' |
  'THINKING' |
  'EXECUTING' |
  'ERROR' |
  'IDLE';

export type ConnekzTranscript = {
  role: 'user' | 'ai';
  message: string;
  at: string; // ISO date string
  conversationId: number;
  forcedDisplay?: boolean; // Whether force to display this message
}

/**
 * A single message in the full conversation history returned by
 * `connekzAgent.getConversation()`. Covers both voice and text turns.
 */
export type ConnekzConversationMessage = {
  id?: string; // Server message id (absent for not-yet-persisted local messages)
  role: 'user' | 'ai' | 'system';
  message: string;
  at: string; // ISO date string (message createdAt)
}

// Export types for consumers of the package
export type ConnekzOptions = {
  clientId: string; // Client ID for the connekz instance
  clientSecret: string; // Client secret for the connekz instance
  chatWindow?: {
    mountElementId: string;
    disableTalkMode?: boolean;
    disableChatMode?: boolean;
  } | undefined;
  aiSphere?: {
    mountElementId: string;
    themeColor?: string;
  };
  transcription?: {
    mountElementId: string;
  };
  connekzControls?: {
    mountElementId: string;
  }
  userIdentity?: string;
  baseUrl?: string; // Base URL for the connekz instance
};

export type ConnectionQuality = {
  signalStrength: 0 | 1 | 2 | 3;
  speedMbps: number | null;
  isWeakForVoice: boolean;
  effectiveType: string | null;
};

/**
 * Error codes for Connekz Agent errors.
 *
 * CNKZ_ERR_1001 - Unable to reach the Connekz server (wrong URL, server down, network/proxy issue).
 *                 The agent keeps retrying automatically, walking a websocket → polling transport ladder.
 * CNKZ_ERR_1002 - Invalid client ID or client secret. Not retried.
 * CNKZ_ERR_1003 - Usage quota exceeded (out of tokens / connection limit). Not retried.
 * CNKZ_ERR_1004 - Weak network connection (voice unreliable; text chat suggested)
 * CNKZ_ERR_1005 - Agent runtime error
 * CNKZ_ERR_1006 - Browser is offline. Reconnects automatically when connectivity returns.
 * CNKZ_ERR_1007 - Session/ephemeral token expired. Mint a fresh token server-side and re-initialize. Not retried.
 * CNKZ_ERR_1008 - This page's origin is not in the instance's authorized domains list. Not retried.
 * CNKZ_ERR_1009 - Browser unsupported (no realtime transport available at all). Not retried.
 * CNKZ_ERR_1010 - Voice unsupported in this environment (insecure context, no mic API/hardware).
 *                 Text chat continues to work.
 */
export type ConnekzErrorCode =
  | 'CNKZ_ERR_1001'
  | 'CNKZ_ERR_1002'
  | 'CNKZ_ERR_1003'
  | 'CNKZ_ERR_1004'
  | 'CNKZ_ERR_1005'
  | 'CNKZ_ERR_1006'
  | 'CNKZ_ERR_1007'
  | 'CNKZ_ERR_1008'
  | 'CNKZ_ERR_1009'
  | 'CNKZ_ERR_1010';

export type ConnekzError = {
  code: ConnekzErrorCode;
  message: string;
  timestamp: number;
};

/** Environment capability snapshot (see ConnekzSocketAPI.getDiagnostics). */
export type ConnekzCapabilities = {
  webSocket: boolean;
  httpTransport: boolean;
  secureContext: boolean;
  online: boolean;
  mediaDevices: boolean;
  audioContext: boolean;
  audioWorklet: boolean;
  localStorage: boolean;
};

/**
 * Connection internals snapshot for debugging and support tickets.
 * `transportStrategy` is the ladder rung last attempted
 * (websocket / polling-upgrade / polling-only); `activeTransport` is what
 * engine.io is actually using when connected.
 */
export type ConnekzDiagnostics = {
  connected: boolean;
  connecting: boolean;
  transportStrategy: string | null;
  activeTransport: string | null;
  attempts: number;
  lastError: { code: ConnekzErrorCode; userMessage: string; devMessage: string; retryable?: boolean } | null;
  capabilities: ConnekzCapabilities;
  baseUrl: string;
};

// New: Subscription types
export type Unsubscriber = () => void;
export interface SocketSubscribeAPI {
  onIsConnectingChange: (cb: (value: boolean) => void) => Unsubscriber;
  onIsConnectedChange: (cb: (value: boolean) => void) => Unsubscriber;
}

export interface AgentSubscribeAPI {
  onAgentStatusChange: (cb: (value: ConnekzAgentStatus) => void) => Unsubscriber;
  onMicStatusChange: (cb: (value: 'active' | 'muted') => void) => Unsubscriber;
  onUserWaveformUpdate: (cb: (value: number) => void) => Unsubscriber;
  onAgentWaveformUpdate: (cb: (value: number) => void) => Unsubscriber;
  onTranscriptUpdate: (cb: (value: readonly ConnekzTranscript[]) => void) => Unsubscriber;
  onToolCall: (cb: (payload: ConnekzToolCallPayload) => Promise<string>) => Unsubscriber;
  onConnectionQualityChange: (cb: (value: ConnectionQuality) => void) => Unsubscriber;
  onError: (cb: (value: ConnekzError) => void) => Unsubscriber;
}

// Headless Socket API exposure (initial values + actions + subs)
export interface ConnekzSocketAPI {
  connect: (force?: boolean) => void;
  disconnect: () => void;
  cleanup: () => void;
  /**
   * Snapshot of connection internals: transport in use, attempt count, last
   * classified error and environment capabilities. Include this in bug
   * reports/support tickets for connection issues.
   */
  getDiagnostics: () => ConnekzDiagnostics;
  subscribe: SocketSubscribeAPI;
}

// Headless Voice Agent API exposure (initial values + actions + subs)
export interface VoiceAgentAPI {
  startAgent: () => Promise<void>;
  stopAgent: () => void;
  injectMessage: (messageText: string) => void;
  /**
   * Load on-demand memories/tools (created with Load Mode "On-Demand" in the
   * portal) into the current session by slug. Calling again replaces the
   * previous set; an empty array clears all on-demand items. Safe to call
   * before startAgent() — pending slugs apply when the session starts.
   */
  setSessionTools: (slugs: string[]) => void;
  startCaptureTest: () => void;
  stopCaptureTest: () => void;
  playCapturedAudio: () => void;
  toggleMic: () => void;
  /**
   * Returns the full conversation history for the current thread as a
   * chronological snapshot (ascending by time). Includes BOTH voice and text
   * turns — seeded from the server thread history and kept live as new messages
   * arrive. Returns an empty array before any conversation exists.
   *
   * Typical use: call this inside an `onToolCall` handler (e.g. when a booking
   * tool fires) to capture the transcript and forward it to your own backend.
   */
  getConversation: () => ConnekzConversationMessage[];
  /**
   * Returns the current chat thread id, or null before a thread is established.
   * Useful for correlating a captured transcript with the server-side thread.
   */
  getThreadId: () => string | null;
  subscribe: AgentSubscribeAPI;
}

// Define the return type of initConnekzChat
export interface ConnekzInstance {
  unmount: () => void;
  connekzSocket: ConnekzSocketAPI;
  connekzAgent: VoiceAgentAPI;
}

/**
 * Initializes the Connekz chat widget in a specified DOM element.
 *
 * @param options - Configuration options for the chat widget.
 * @returns An instance of the chat widget with methods to interact with it.
 */
export default function initConnekz(options: ConnekzOptions): ConnekzInstance;

declare module '@connekz/connekz-agent';