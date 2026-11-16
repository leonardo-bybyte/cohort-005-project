import {
  discussionLabel,
  noteDraft,
  openingTab,
  type CountableComment,
  type NoteDraft,
  type WorkspaceTab,
} from "./lib/workspace";

export type { CountableComment, NoteDraft, WorkspaceTab };

/**
 * The panel under a lesson where a Student's private notes sit beside the
 * course's Questions & Discussion, one tab each.
 */
export const lessonWorkspace = {
  /** Which tab opens first: notes when the Student already has some. */
  openingTab,
  /**
   * The discussion tab's label, with the count of comments and replies once
   * there is one. Deleted comments do not count; their replies do.
   */
  discussionLabel,
  /**
   * What the notes editor shows for the text in the box against the note
   * last saved: the character count, whether it is over the limit, and
   * whether Save does anything.
   */
  noteDraft,
};
