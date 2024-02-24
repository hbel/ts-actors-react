import { useEffect, useState } from "react";
import { useActorSystem, SystemContext, useStatefulActor, useActor } from "../../src/index";
import { CountingActor } from "./CountingActor";
import { MessengerActor } from "./MessengerActor";

function Counter() {
	const messenger = useActor("Messenger");
	const [counter] = useStatefulActor<{ counter: number }>("Counter", { counter: 0 });
	const click = () => {
		messenger.forEach(actorRef => actorRef.send(actorRef, "Do something"));
	};
	return (
		<div style={{ display: "flex", flexDirection: "column" }}>
			<div>Counter is: {counter.map(c => c.counter).orElse(0)}</div>
			<div>
				<button onClick={click}>Add 1</button>
			</div>
		</div>
	);
}

function App() {
	const [initializing, setInitializing] = useState(true);
	const system = useActorSystem();
	useEffect(() => {
		if (initializing) {
			system.forEach(async s => {
				const counter = await s.createActor(CountingActor, { name: "Counter" }, 0);
				await s.createActor(MessengerActor, { name: "Messenger" }, counter);
				setInitializing(false);
			});
		}
	}, [system, initializing]);
	if (initializing) {
		return <div>Loading</div>;
	}
	return (
		<SystemContext.Provider value={system}>
			<Counter />
		</SystemContext.Provider>
	);
}

export default App;
