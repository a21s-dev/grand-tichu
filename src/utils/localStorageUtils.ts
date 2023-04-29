import { GLOBAL_STATE_SCHEMA } from '../store/store.ts';


export function getState() {
	const rawState = localStorage.getItem('state');
	if (rawState == null) {
		throw new Error('did not found state');
	}
	const parsedState = JSON.parse(rawState);
	return GLOBAL_STATE_SCHEMA.parse(parsedState);
}