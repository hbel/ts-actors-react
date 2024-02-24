import { useState, useEffect, useContext, useRef } from "react";
import { ActorRef } from "ts-actors";
import { SystemContext } from "../SystemContext";
import { Maybe, Try, fromError, fromValue, maybe } from "tsmonads";
import { v4 } from "uuid";

/**
 * Use a stateful actor inside of an react component. In addition to useActor, this hook also provides the state of the actor.
 * @param name Name of the actor (optionally including prefix and system name)
 * @param initialState Optional initial state of the actor. Usually can be left empty.
 * @returns Maybe<State> containing the state and Try<ActorRef> containing an actor reference to the actor
 */
export const useStatefulActor = <T>(
	name: string,
	initialState: T | undefined = undefined
): [Maybe<T>, Try<ActorRef>] => {
	const [state, setState] = useState<T | undefined>(initialState);
	const maybeSystem = useContext(SystemContext);
	const [result, setResult] = useState<Try<ActorRef>>(fromError(new Error("No actor system in context")));
	const id = useRef(v4());
	useEffect(() => {
		maybeSystem.forEach(system => {
			const actorOrError = system.getActorRef("actors://" + system.systemName + "/" + name) as ActorRef;
			if (actorOrError instanceof Error) {
				setResult(fromError(actorOrError));
				return () => {};
			} else {
				const callback = (x: T) => setState(x);
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				(actorOrError as any).actor.stateChanged.set(id, callback);
				setResult(fromValue(actorOrError));
				if ((actorOrError as any).actor.state) {
					setState((actorOrError as any).actor.state);
				}
				return () => {
					(actorOrError as any).actor.stateChanged.delete(id);
				};
			}
		});
	}, [maybeSystem, name]);
	return [maybe(state), result];
};
