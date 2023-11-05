import { AppState } from "../models/AppState"
import { TaskList } from "../models/TaskList"

export const APP_VERSION = "0"

type StateUpdate = (state: AppState) => AppState

const UPGRADES: Record<number, StateUpdate> = {
	0: (state: AppState) => {
		// state.bookmarks.forEach((bookmark) => {
		// 	const date = new Date().toISOString()
		// 	bookmark.createdAt = bookmark.updatedAt = date
		// })
		return state
	},
}

export function upgradeState(state: AppState): AppState {
	while (state.version !== APP_VERSION) {
		const version = Number(state.version ?? 0)
		if (version in UPGRADES) {
			state = UPGRADES[version](state)
		} else {
			state = new AppState(APP_VERSION, new TaskList([]))
		}
	}
	return state
}
