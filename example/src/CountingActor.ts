import { ActorRef, ActorSystem } from "ts-actors";
import { StatefulActor } from "../../src/StatefulActor";

export type State = {
	counter: number;
};

export class AddMessage {
	constructor(public readonly count: number) {}
}

export class CountingActor extends StatefulActor<AddMessage, void, State> {
	public constructor(name: string, system: ActorSystem, init: number) {
		super(name, system);
		this.state = { counter: init };
	}

	public async receive(from: ActorRef, msg: AddMessage): Promise<void> {
		console.log("Received from ", from.name, " with count ", msg.count);
		this.updateState(draft => {
			draft.counter += msg.count;
		});
	}
}
