import { PartySocket } from "partysocket";
import { usePartySocket } from "partysocket/react";
import { StreamOptions } from "./client.js";

/**
 * Options for the useAgent hook
 * @template State Type of the Agent's state
 */
type UseAgentOptions<State = unknown> = Omit<
  Parameters<typeof usePartySocket>[0],
  "party" | "room"
> & {
  /** Name of the agent to connect to */
  agent: string;
  /** Name of the specific Agent instance */
  name?: string;
  /** Called when the Agent's state is updated */
  onStateUpdate?: (state: State, source: "server" | "client") => void;
};
/**
 * React hook for connecting to an Agent
 * @template State Type of the Agent's state
 * @param options Connection options
 * @returns WebSocket connection with setState and call methods
 */
declare function useAgent<State = unknown>(
  options: UseAgentOptions<State>
): PartySocket & {
  agent: string;
  name: string;
  setState: (state: State) => void;
  call: <T = unknown>(
    method: string,
    args?: unknown[],
    streamOptions?: StreamOptions
  ) => Promise<T>;
};

export { type UseAgentOptions, useAgent };
