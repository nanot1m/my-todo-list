import { AppState, AppStateJSON } from "../models/AppState"
import { TaskList } from "../models/TaskList"
import { restoreFileHandle } from "./file-system-storage"
import { observable, runInAction, action } from "mobx"

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

export class StateStorage {
	@observable accessor state: AppState | undefined
	@observable accessor status: "loading" | "loaded" | "error" = "loading"

	@observable accessor fileHandle: FileSystemFileHandle | undefined =
		undefined

	constructor(state?: AppState) {
		this.state = state
	}

	@action
	async restoreFromFile(): Promise<void> {
		this.status = "loading"
		const fileHandle = await restoreFileHandle()
		if (fileHandle) {
			this.fileHandle = fileHandle
			const file = await fileHandle.getFile()
			const state = upgradeState(
				AppState.fromJSON(AppStateJSON.parse(await file.text())),
			)
			runInAction(() => {
				this.state = state
				this.status = "loaded"
			})
		} else {
			runInAction(() => {
				this.state = new AppState(APP_VERSION, new TaskList([]))
				this.status = "loaded"
			})
		}
	}
}
