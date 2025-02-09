import { useEffect, useState, useMemo, useRef } from "react";
import { nanoid } from "nanoid";
import { useDialog } from "@/hooks/useDialog";
import useSWR from "swr";
import MarkdownEditor from "react-markdown-editor-lite";
import {
    getAllNotes,
    saveNote,
    deleteNote,
    exportNotes,
    type NoteDB,
    syncNotesFromRemote,
    cancelDeleteNote,
} from "../utils/db";
import { Button } from "../components/ui/button";
import { PlusIcon, SaveIcon, DownloadIcon, ArrowLeft, Pencil, Trash2, X } from "lucide-react";
import { Loading } from "@/components/ui/loading";
import MarkdownContent from "@/components/MarkdownContent";
import { useTheme } from "@/ThemeProvider";
import { convertImageToBase64, base64ToBlob, createObjectURL } from "@/utils/image";
import "react-markdown-editor-lite/lib/index.css";

function parseTitle(content: string): string {
    const titleMatch = content.match(/<!--\s*title:\s*([^\s][^>]*)\s*-->/i);
    if (titleMatch) {
        return titleMatch[1].trim();
    }
    // 如果没有标题，取内容的前30个字符（去除markdown标记）
    const plainText = content
        .replace(/<!--[\s\S]*?-->/g, "") // 移除注释
        .replace(/[\[\]\(\)\#\*\_\`]/g, "") // 移除markdown标记
        .trim();
    return plainText.slice(0, 30) || "无标题";
}

type Note = NoteDB["notes"]["value"];

export default function Notes() {
    const imgUrlsRef = useRef<string[]>([]);
    const [notes, setNotes] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [draftContent, setDraftContent] = useState("");

    const { realTheme } = useTheme();
    const markdownTheme = realTheme === "dark" ? "md-theme-juejin-dark" : "md-theme-cyanosis";

    // 获取远程markdown文件内容
    const { data: remoteContent, isLoading: isNoteLoading } = useSWR<string>(
        // 只有选中了已同步的笔记时才请求
        selectedNote?.synced || (selectedNote?.synced && selectedNote?.deleted)
            ? `/blog/notes/${selectedNote.title}_${selectedNote.id.substring(0, 6)}.md`
            : null,
        async (url) => {
            const response = await fetch(url);
            if (!response.ok) throw new Error("无法获取笔记内容");
            return response.text();
        },
        {
            revalidateOnFocus: false,
            dedupingInterval: 60000,
        }
    );

    useEffect(() => {
        if (remoteContent !== undefined) {
            setSelectedNote((note) => ({ ...note!, content: remoteContent }));
        }
    }, [remoteContent]);

    const replaceMarkdownImages = (originContent: string): string => {
        if (!originContent) return "";
        // 将内容中的 base64 图片转换为 blob URL
        const regex = /!\[([^\]]*)\]\(data:image\/[^;]+;base64,[^)]+\)/g;
        let content = originContent;
        const urls: string[] = [];

        content = content.replace(regex, (match) => {
            const base64 = match.slice(match.indexOf("(") + 1, -1);
            const blob = base64ToBlob(base64);
            const url = createObjectURL(blob);
            urls.push(url);
            return match.replace(base64, url);
        });

        imgUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        imgUrlsRef.current = urls;

        setDraftContent(content);

        return content;
    };

    const { data: remoteNotes, isLoading: isSyncing } = useSWR<NoteDB["notes"]["value"][]>(
        "/blog/notes/notes-data.json",
        async (url) => {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("无法获取远程笔记数据");
                return response.json();
            } catch (error) {
                console.error("获取远程笔记失败:", error);
                return [];
            }
        },
        {
            refreshInterval: 0, // 不自动刷新
            revalidateOnFocus: true, // 不在窗口聚焦时刷新
            dedupingInterval: 60000, // 1分钟内不重复请求
        }
    );

    const unsyncedNotesCount = useMemo(() => {
        return notes.filter((note) => !note.synced).length;
    }, [notes]);

    useEffect(() => {
        if (remoteNotes?.length) {
            syncNotesFromRemote(remoteNotes).then(() => loadNotes());
        }
    }, [remoteNotes]);

    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        const allNotes = await getAllNotes();
        // 按更新时间降序排序
        const sortedNotes = allNotes.sort((a, b) => {
            const timeA = new Date(a.updatedAt).getTime();
            const timeB = new Date(b.updatedAt).getTime();
            return timeB - timeA;
        });
        setNotes(sortedNotes);
    };

    const createNewNote = async () => {
        if (selectedNote && isEditing) {
            const confirmed = await showConfirm({
                title: "提示",
                description: "当前随记尚未保存，确定要放弃吗？",
            });
            if (!confirmed) return;
            setIsEditing(false);
        }
        const defaultTitle = "新随记";
        const initialContent = `<!-- title: ${defaultTitle} --> \n\n请在这里输入随记内容...`;
        const newNote = {
            id: nanoid(),
            title: defaultTitle,
            content: initialContent,
            createdAt: new Date().toLocaleString(),
            updatedAt: new Date().toLocaleString(),
            synced: false,
            deleted: false,
        };
        await saveNote(newNote);
        await loadNotes();
        setSelectedNote(newNote);
        setDraftContent(newNote.content);
        setIsEditing(true);
    };

    const handleSave = async () => {
        if (!selectedNote) return;

        // 将 blob URL 转回 base64
        let content = draftContent;
        for (const url of imgUrlsRef.current) {
            if (url.startsWith("blob:")) {
                const response = await fetch(url);
                const blob = await response.blob();
                const base64 = await new Promise<string>((resolve) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result as string);
                    reader.readAsDataURL(blob);
                });
                content = content.replace(url, base64);
            }
        }

        const title = parseTitle(content);
        const updatedNote = {
            ...selectedNote,
            title,
            content,
            updatedAt: new Date().toLocaleString(),
            synced: false,
        };
        await saveNote(updatedNote);
        await loadNotes();
        setSelectedNote(updatedNote);
        setIsEditing(false);
    };

    const { modalSlot, show: showConfirm } = useDialog();

    const handleDelete = async () => {
        if (!selectedNote) return;
        const isRemoteNote = remoteNotes?.some((item) => item.id === selectedNote.id);
        const confirmed = await showConfirm({
            title: "确认删除",
            description: isRemoteNote
                ? "该笔记将在下次同步后被删除，确定要继续吗？"
                : "该笔记将被直接删除，确定要继续吗？",
            confirmText: "删除",
        });

        if (confirmed) {
            const forceDelete = !isRemoteNote;
            await deleteNote(selectedNote.id, forceDelete);
            await loadNotes();
            setSelectedNote(null);
            setIsEditing(false);
        }
    };

    const handleCancelDelete = async () => {
        if (!selectedNote) return;
        const confirmed = await showConfirm({
            title: "取消删除",
            description: "确定要取消删除该笔记吗？",
            confirmText: "确定",
        });

        if (confirmed) {
            await cancelDeleteNote(selectedNote.id);
            await loadNotes();
            setSelectedNote((note) => ({ ...note!, deleted: false }));
        }
    };

    const handleSelectNote = async (note: Note) => {
        if (selectedNote?.id === note.id) return;
        if (isEditing) {
            const confirmed = await showConfirm({
                title: "提示",
                description: "当前随记尚未保存，确定要放弃吗？",
            });
            if (!confirmed) return;
        }

        // 直接渲染base64解析会很耗时，转化为blob URL后再渲染
        const replacedNote = {
            ...note,
            content: replaceMarkdownImages(note.content),
        };
        setSelectedNote(replacedNote);
        setIsEditing(false);
    };

    return (
        <div className="flex h-[calc(100vh-73px)]">
            <div className="border-r pl-4 flex flex-col w-1/5 min-w-[240px] overflow-x-hidden">
                <div className="mb-4 p-4 pb-0">
                    <div className="flex justify-between items-center gap-2 mb-4">
                        <h2 className="text-xl font-bold">随记列表</h2>
                        {!!unsyncedNotesCount && (
                            <span className="mr-3 px-2 py-1 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full">
                                未同步数量{unsyncedNotesCount}
                            </span>
                        )}
                    </div>
                    <div className="flex gap-2 justify-end">
                        {!!unsyncedNotesCount && (
                            <Button
                                onClick={() => exportNotes()}
                                size="sm"
                                variant="outline"
                                disabled={isSyncing || !unsyncedNotesCount}
                            >
                                <DownloadIcon className="w-4 h-4" />
                                同步
                            </Button>
                        )}
                        <Button onClick={createNewNote} size="sm">
                            <PlusIcon className="w-4 h-4" />
                            新建
                        </Button>
                    </div>
                </div>
                <div className="pr-4 space-y-2 overflow-y-auto overflow-x-hidden note-list flex-1">
                    {notes.map((note) => (
                        <div
                            key={note.id}
                            className={`p-3 rounded mb-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 ${
                                selectedNote?.id === note.id ? "bg-gray-100 dark:bg-gray-800" : ""
                            }`}
                            onClick={() => handleSelectNote(note)}
                        >
                            <div className="flex items-center gap-2 mb-1 justify-between">
                                <p
                                    className={`font-medium text-ellipsis overflow-hidden whitespace-nowrap ${note.deleted ? "line-through text-red-500 dark:text-red-400" : ""}`}
                                >
                                    {note.title}
                                </p>
                                {!note.synced && (
                                    <span className="px-1.5 py-0.5 text-xs bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-full text-nowrap">
                                        {note.deleted ? "待同步删除" : "未同步"}
                                    </span>
                                )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {new Date(note.updatedAt).toLocaleString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex-1 pt-4 overflow-y-auto">
                {selectedNote ? (
                    <div className="h-full flex flex-col">
                        <div className="flex justify-between items-center mb-4 px-4">
                            <div className="flex items-center gap-2">
                                {isEditing ? (
                                    <Button
                                        variant="outline"
                                        disabled={selectedNote.deleted}
                                        onClick={() => {
                                            setDraftContent(selectedNote.content);
                                            setIsEditing(false);
                                        }}
                                    >
                                        <X className="h-4 w-4" />
                                        取消
                                    </Button>
                                ) : (
                                    <Button
                                        variant="outline"
                                        disabled={selectedNote.deleted}
                                        onClick={() => {
                                            setDraftContent(selectedNote.content);
                                            setIsEditing(true);
                                        }}
                                    >
                                        <Pencil className="h-4 w-4" />
                                        编辑
                                    </Button>
                                )}

                                {isEditing && !selectedNote.deleted && (
                                    <Button onClick={handleSave}>
                                        <SaveIcon className="w-4 h-4" />
                                        保存
                                    </Button>
                                )}
                                {selectedNote.deleted ? (
                                    <Button variant="destructive" onClick={handleCancelDelete}>
                                        <ArrowLeft className="h-4 w-4" />
                                        撤回删除
                                    </Button>
                                ) : (
                                    <Button variant="destructive" onClick={handleDelete}>
                                        <Trash2 className="h-4 w-4" />
                                        删除
                                    </Button>
                                )}
                            </div>
                        </div>
                        {isEditing && !selectedNote.deleted ? (
                            <MarkdownEditor
                                value={draftContent}
                                onChange={({ text }) => setDraftContent(text)}
                                className="flex-1 h-full overflow-hidden mx-4 mb-4"
                                renderHTML={(text) => (
                                    <MarkdownContent
                                        showCodeParseLoading={false}
                                        canImgZoom={false}
                                        className={markdownTheme}
                                        content={text}
                                    />
                                )}
                                syncScrollMode={["rightFollowLeft"]}
                                view={{ menu: true, md: true, html: true }}
                                placeholder="在这里输入markdown内容..."
                                onImageUpload={async (file) => {
                                    try {
                                        const base64 = await convertImageToBase64(file);
                                        const blob = base64ToBlob(base64);
                                        const url = createObjectURL(blob);
                                        imgUrlsRef.current.push(url);
                                        setDraftContent((prev) => {
                                            const lastBase64Index = prev.lastIndexOf(base64);
                                            if (lastBase64Index !== -1) {
                                                return (
                                                    prev.substring(0, lastBase64Index) +
                                                    url +
                                                    prev.substring(lastBase64Index + base64.length)
                                                );
                                            }
                                            return prev;
                                        });
                                        return url;
                                    } catch (error) {
                                        console.error("图片转换失败:", error);
                                        return "";
                                    }
                                }}
                            />
                        ) : (
                            <div
                                className={"prose dark:prose-invert max-w-none flex-1 overflow-y-scroll px-4 relative"}
                            >
                                {isNoteLoading ? (
                                    <Loading />
                                ) : (
                                    <MarkdownContent
                                        content={selectedNote.content}
                                        canImgZoom={true}
                                        className={markdownTheme}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">选择或创建一个随记开始</div>
                )}
            </div>
            {modalSlot}
        </div>
    );
}
