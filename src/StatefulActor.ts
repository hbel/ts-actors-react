import { create } from "mutative";
import { Actor } from "ts-actors";

/**
 * Abstract base class for actors that can provide a state to react components (via useStatefulActor).
 */
export abstract class StatefulActor<T, U, V> extends Actor<T, U> {
	/**
	 * Map containing observers to synchronize state with react. THIS IS NOT MEANT TO BE USED DIRECTLY. useStatefulActor will use this dynamically.
	 */
	public stateChanged = new Map<string, (state: V) => void>();

	/**
	 * State of the actor
	 */
	protected state!: V;

	/**
	 * Method to update the state from the actor (e.g. from its receive() method). Automatically updates react states, too.
	 * @param drafting mutative draft function describing the state update.
	 */
	protected updateState = (drafting: (draft: V) => void) => {
		const newState = create(this.state, drafting);
		this.state = newState;
		for (const [_, observer] of this.stateChanged) {
			observer(newState);
		}
	};
}
