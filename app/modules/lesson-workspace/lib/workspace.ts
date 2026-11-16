import { MAX_NOTE_LENGTH } from "~/lib/notes";

export type WorkspaceTab = "discussion" | "notes";

export type NoteDraft = {
  length: number;
  max: number;
  tooLong: boolean;
  empty: boolean;
  unsaved: boolean;
  canSave: boolean;
};

export function openingTab(hasNote: boolean): WorkspaceTab {
  // A Student coming back to a lesson they took notes on wants their notes.
  return hasNote ? "notes" : "discussion";
}

export type CountableComment = {
  deleted: boolean;
  replies: CountableComment[];
};

function countComments(comments: CountableComment[]): number {
  return comments.reduce(
    (total, comment) =>
      total + (comment.deleted ? 0 : 1) + countComments(comment.replies),
    0
  );
}

export function discussionLabel(comments: CountableComment[]): string {
  const count = countComments(comments);
  return count === 0 ? "Discussion" : `Discussion (${count})`;
}

export function noteDraft(draft: string, saved: string | null): NoteDraft {
  const tooLong = draft.length > MAX_NOTE_LENGTH;
  const empty = draft.trim().length === 0;
  const unsaved = draft !== (saved ?? "");
  return {
    length: draft.length,
    max: MAX_NOTE_LENGTH,
    tooLong,
    empty,
    unsaved,
    canSave: unsaved && !empty && !tooLong,
  };
}
