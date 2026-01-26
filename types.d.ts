// src/index.d.ts
import 'unfonts.css';

// Alias AppProps as ConnekzChatOptions
export type ConnekzChatOptions = {
  clientId: string;
  clientSecret: string;
  userIdentity?: string;
  baseUrl?: string;
};

// Define the props interface for App.vue
export interface AppProps {
  sampleProperty: string; // Sample property for now
}

// Define the emits type for App.vue
export type AppEmits = {
  'sample-event': (value: string) => void;
};

// Define the exposed functions interface for App.vue
export interface AppExposed {
  sampleExposeFunction: (message: string) => void;
}

// Export types for consumers of the package
export type { AppProps, AppExposed, AppEmits };

// Define the return type of initConnekzChat
export interface ConnekzChatInstance extends AppEmits, AppExposed {
  unmount: () => void;
}

/**
 * Initializes the Connekz chat widget in a specified DOM element.
 * @param divId - The ID of the parent div where the chat widget will be mounted.
 * @param options - Configuration options for the chat widget.
 * @returns An instance of the chat widget with methods to interact with it.
 */
export default function initConnekzChat(divId: string, options: ConnekzChatOptions): ConnekzChatInstance;

declare module '@connekz/connekz-agent';

declare module '*.webp' {
  const value: string;
  export default value;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

export type GenericColors = 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error';