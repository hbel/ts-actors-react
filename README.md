# ts-actors-react

React integration for the ts-actors library.

This small library provides functionality to directly work with the actor systems from the `ts-actors` library in _React_. It can be used to instantiate an actor system that exclusively exists in the browser or to create a system that interacts with a server system via websockets.

## Minimal example

See the example subdirectory for a full example. In general:

1. Create some actors, e.g.

```typescript
type State = {
	counter: number;
};

class AddMessage {
	constructor(public readonly count: number) {}
}

class CountingActor extends StatefulActor<AddMessage, void, State> {
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
```

2. Use them in your app

```typescript
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
```
