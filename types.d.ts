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
 * CNKZ_ERR_1001 - Unable to reach the Connekz server (wrong URL, server down, network issue)
 * CNKZ_ERR_1002 - Invalid client ID or client secret
 * CNKZ_ERR_1003 - Usage quota exceeded (out of tokens)
 * CNKZ_ERR_1004 - Weak network connection (voice unreliable)
 * CNKZ_ERR_1005 - Agent runtime error
 */
export type ConnekzErrorCode =
  | 'CNKZ_ERR_1001'
  | 'CNKZ_ERR_1002'
  | 'CNKZ_ERR_1003'
  | 'CNKZ_ERR_1004'
  | 'CNKZ_ERR_1005';

export type ConnekzError = {
  code: ConnekzErrorCode;
  message: string;
  timestamp: number;
};

// New: Subscription types
export type Unsubscriber = () => void;
export interface SocketSubscribeAPI {
  onIsConnectingChange: (cb: (value: boolean) => void) => Unsubscriber;
  onIsConnectedChange: (cb: (value: boolean) => void) => Unsubscriber;
}

export interface AgentSubscribeAPI {
  onAgentStatusChange: (cb: (value: VoiceAgentStatus) => void) => Unsubscriber;
  onMicStatusChange: (cb: (value: 'active' | 'muted') => void) => Unsubscriber;
  onUserWaveformUpdate: (cb: (value: number) => void) => Unsubscriber;
  onAgentWaveformUpdate: (cb: (value: number) => void) => Unsubscriber;
  onTranscriptUpdate: (cb: (value: readonly ConnekzConversation[]) => void) => Unsubscriber;
  onToolCall: (cb: (payload: ConnekzToolCallPayload) => Promise<string>) => Unsubscriber;
  onConnectionQualityChange: (cb: (value: ConnectionQuality) => void) => Unsubscriber;
  onError: (cb: (value: ConnekzError) => void) => Unsubscriber;
}

// Headless Socket API exposure (initial values + actions + subs)
export interface ConnekzSocketAPI {
  connect: (force?: boolean) => void;
  disconnect: () => void;
  cleanup: () => void;
  subscribe: SocketSubscribeAPI;
}

// Headless Voice Agent API exposure (initial values + actions + subs)
export interface VoiceAgentAPI {
  startAgent: () => Promise<void>;
  stopAgent: () => void;
  makeSleep: () => void;
  injectMessage: (messageText: string) => void;
  startCaptureTest: () => void;
  stopCaptureTest: () => void;
  playCapturedAudio: () => void;
  toggleMic: () => void;
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