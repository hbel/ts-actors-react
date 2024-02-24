import { useState, useEffect, useContext } from "react";
import { ActorRef } from "ts-actors";
import { SystemContext } from "../SystemContext";
import { Try, fromError, fromValue } from "tsmonads";

const URI_PREFIX = "actors://";

/**
 * Use an actor inside of an react component. This hook can be used to send messages to or from the actor.
 * @param name Name of the actor (optionally including prefix and system name)
 * @returns Try<ActorRef> containing an actor reference to the actor
 */
export const useActor = (name: string): Try<ActorRef> => {
	const maybeSystem = useContext(SystemContext);
	const [result, setResult] = useState<Try<ActorRef>>(fromError(new Error("No actor system in context")));
	useEffect(() => {
		maybeSystem.forEach(system => {
			const uri = name.startsWith(URI_PREFIX) ? name : `${URI_PREFIX + system.systemName}/${name}`;
			const actorOrError = system.getActorRef(uri) as ActorRef;
			if (actorOrError instanceof Error) {
				setResult(fromError(actorOrError));
			} else {
				setResult(fromValue(actorOrError));
			}
		});
	}, [maybeSystem, name]);
	return result;
};
