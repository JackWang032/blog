import { openDB, type DBSchema } from "idb";

export interface NoteDB extends DBSchema {
    notes: {
        key: string;
        value: {
            id: string;
            title: string;
            content: string;
            createdAt: string;
            updatedAt: string;
            synced: boolean;
            deleted: boolean;
        };
        indexes: { "by-create-date": string };
    };
}

const DB_NAME = "notes-db";
const STORE_NAME = "notes";

export const db = await openDB<NoteDB>(DB_NAME, 3, {
    upgrade(db) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "id" });
        store.createIndex("by-create-date", "createdAt");
    },
});

export async function getAllNotes() {
    const notes = await db.getAllFromIndex(STORE_NAME, "by-create-date");
    return notes;
}

export async function syncNotesFromRemote(remoteNotes: NoteDB["notes"]["value"][]) {
    const localNotes = await getAllNotes();
    const localNotesMap = new Map(localNotes.map((note) => [note.id, note]));

    for (const remoteNote of remoteNotes) {
        const localNote = localNotesMap.get(remoteNote.id);
        if (!localNote || new Date(remoteNote.updatedAt) >= new Date(localNote.updatedAt)) {
            // 远程笔记更新，使用远程版本并标记为已同步
            await saveNote({ ...remoteNote, synced: true });
        }
    }
}

export async function getNote(id: string) {
    return db.get(STORE_NAME, id);
}

export async function saveNote(note: NoteDB["notes"]["value"]) {
    return db.put(STORE_NAME, { ...note });
}

export async function deleteNote(id: string, forceDelete = false) {
    const note = await db.get(STORE_NAME, id);
    if (!note) return;

    // 如果是未同步的笔记，直接删除
    if (forceDelete) {
        return db.delete(STORE_NAME, id);
    }

    // 如果是已同步的笔记，标记为已删除
    return db.put(STORE_NAME, { ...note, deleted: true });
}

export async function cancelDeleteNote(id: string) {
    const note = await db.get(STORE_NAME, id);
    if (!note || !note.deleted) return;

    // 取消删除标记，恢复为已同步状态
    return db.put(STORE_NAME, { ...note, deleted: false });
}

export async function exportNotes() {
    const notes = await getAllNotes();
    // 始终只导出未同步的笔记
    const notesToExport = notes.filter((note) => !note.synced || (note.synced && note.deleted));

    // 如果没有未同步的笔记，直接返回
    if (notesToExport.length === 0) {
        return;
    }

    // 导出 notes-data.json
    const blob = new Blob([JSON.stringify(notesToExport, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "notes-data.json";
    a.click();
    URL.revokeObjectURL(url);

    // 标记已导出的笔记为已同步
    await Promise.all(notesToExport.map((note) => saveNote({ ...note, synced: true })));
}
