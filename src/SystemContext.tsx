import { createContext } from "react";
import { ActorSystem } from "ts-actors";
import { Failure, Try } from "tsmonads";

/**
 * Context to provide access to the local actor system
 *
 * @example Minimal example
 *
 * const Root = ({children}) => {
 *  const system = useSystemInit().toMaybe();
 *  return (
 * 	 <SystemContext.Provider value={system}>
 *	   {children}
 *   </SystemContext.Provider>
 *  );
 * };
 */
export const SystemContext = createContext<Try<ActorSystem>>(new Failure(new Error("Not initialized yet")));
