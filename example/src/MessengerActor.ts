import { Actor, ActorRef, ActorSystem } from "ts-actors";
import { AddMessage } from "./CountingActor";

export class MessengerActor extends Actor<string, void> {
	public constructor(
		name: string,
		system: ActorSystem,
		private readonly receiver: ActorRef
	) {
		super(name, system);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	public async receive(_from: ActorRef, _msg: string): Promise<void> {
		this.send(this.receiver, new AddMessage(1));
	}
}
