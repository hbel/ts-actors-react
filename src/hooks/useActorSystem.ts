import { useEffect, useState } from "react";
import { ActorSystem, DistributedActorSystem } from "ts-actors";
import { WebsocketDistributor } from "ts-actors/lib/src/WebsocketDistributor";
import { Try, fromError, fromValue } from "tsmonads";
import { v4 } from "uuid";

/**
 * System initialization hook. Creates the actor system in the client app.
 * @param serverUri optional server uri. If omitted, a local system will be created. Otherwise, a distributed system based on websockets will be created.
 * @param authToken optional auth token to be send to the server if a distributed system is used.
 * @returns Try<ActorSystem> containing the actor system
 */
export const useActorSystem = (serverUri?: string, authToken?: string): Try<ActorSystem> => {
	const [systemOrError, setSystemOrError] = useState<ActorSystem | Error>(new Error("Not initialized yet"));

	useEffect(() => {
		let ignore = false;
		if (!ignore) {
			const systemId = v4();
			if (!serverUri) {
				ActorSystem.create({ systemName: systemId })
					.then(system => {
						setSystemOrError(system);
					})
					.catch(error => {
						setSystemOrError(error);
					});
			} else {
				const distributor = new WebsocketDistributor(
					systemId,
					`${serverUri}/ws?clientActorSystem=${systemId}`,
					authToken
				);
				DistributedActorSystem.create({ distributor, systemName: systemId })
					.then(system => {
						setSystemOrError(system);
					})
					.catch(error => setSystemOrError(error));
			}
		}
		return () => {
			if (ignore && !(systemOrError instanceof Error)) systemOrError?.shutdown();
			ignore = true;
		};
	}, [serverUri, authToken]);

	return systemOrError instanceof Error ? fromError(systemOrError) : fromValue(systemOrError);
};
