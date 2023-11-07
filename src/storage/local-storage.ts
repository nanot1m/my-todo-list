import { AppState, AppStateJSON } from "../models/AppState"
import { APP_VERSION, getInitialState, IStorageProvider } from "./index"

const LS_KEY = "MyTodoListState"

export const localStorageProvider: IStorageProvider = {
	async getState() {
		const strState = localStorage.getItem(LS_KEY)
		const json = AppStateJSON.safeParse(strState)
		if (json.success) return AppState.fromJSON(json.data)
		return getInitialState(APP_VERSION)
	},
	setState(state) {
		localStorage.setItem(LS_KEY, JSON.stringify(state.toJSON()))
	},
}
