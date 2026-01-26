export type ConnekzToolCallPayload = {
  arguments: Record<string, any>;
  name: string;
};

/**
 * Enum for voice agent statuses
 */
export type ConnekzAgentStatus =
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