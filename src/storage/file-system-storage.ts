import { fileOpen, fileSave } from "browser-fs-access"
import { get as idbGet, set as idbSet } from "idb-keyval"

import { AppState, AppStateJSON } from "../models/AppState"

const IDB_FILE_HANDLE_KEY = "idb_file_handle_key"

export async function saveFileHandle(
	handle: FileSystemFileHandle,
): Promise<void> {
	await idbSet(IDB_FILE_HANDLE_KEY, handle)
}

export function restoreFileHandle(): Promise<FileSystemFileHandle | undefined> {
	return idbGet(IDB_FILE_HANDLE_KEY)
}

export async function saveToFile(
	state: AppState,
	name: string = "Untitled",
	handle?: FileSystemFileHandle,
) {
	const blob = new Blob([JSON.stringify(state.toJSON())], {
		type: "application/json",
	})
	const fileHandle = await fileSave(
		blob,
		{
			fileName: name,
			description: "My todo list file",
			extensions: [".mtl"],
		},
		handle,
	)
	return { fileHandle }
}

export type LoadedFile = {
	state: AppState
	name: string
	handle?: FileSystemFileHandle
}

export async function loadFromFile() {
	const blob = await fileOpen({
		description: "My todo list file",
		extensions: [".mtl"],
	})
	return {
		state: AppState.fromJSON(
			AppStateJSON.parse(JSON.parse(await blob.text())),
		),
		name: blob.name,
		handle: blob.handle,
	}
}
