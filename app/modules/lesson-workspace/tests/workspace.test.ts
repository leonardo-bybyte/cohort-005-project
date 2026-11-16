import { describe, expect, it } from "vitest";
import { lessonWorkspace, type CountableComment } from "../index";
import { MAX_NOTE_LENGTH } from "~/lib/notes";

describe("lessonWorkspace.openingTab", () => {
  it("opens on the discussion when the learner has no note", () => {
    expect(lessonWorkspace.openingTab(false)).toBe("discussion");
  });

  it("opens on the notes when the learner has one", () => {
    expect(lessonWorkspace.openingTab(true)).toBe("notes");
  });
});

describe("lessonWorkspace.discussionLabel", () => {
  const comment = (
    replies: CountableComment[] = [],
    deleted = false
  ): CountableComment => ({ deleted, replies });

  it("leaves the count off an empty discussion", () => {
    expect(lessonWorkspace.discussionLabel([])).toBe("Discussion");
  });

  it("counts comments and their replies", () => {
    expect(lessonWorkspace.discussionLabel([comment()])).toBe("Discussion (1)");
    expect(
      lessonWorkspace.discussionLabel([
        comment([comment(), comment()]),
        comment(),
      ])
    ).toBe("Discussion (4)");
  });

  it("skips deleted comments but keeps their replies", () => {
    expect(lessonWorkspace.discussionLabel([comment([comment()], true)])).toBe(
      "Discussion (1)"
    );
    expect(lessonWorkspace.discussionLabel([comment([], true)])).toBe(
      "Discussion"
    );
  });
});

describe("lessonWorkspace.noteDraft", () => {
  it("cannot save an untouched empty box", () => {
    expect(lessonWorkspace.noteDraft("", null)).toEqual({
      length: 0,
      max: MAX_NOTE_LENGTH,
      tooLong: false,
      empty: true,
      unsaved: false,
      canSave: false,
    });
  });

  it("can save new text", () => {
    const draft = lessonWorkspace.noteDraft("Result types", null);
    expect(draft).toMatchObject({ length: 12, unsaved: true, canSave: true });
  });

  it("treats whitespace as empty", () => {
    const draft = lessonWorkspace.noteDraft("   \n", null);
    expect(draft).toMatchObject({ empty: true, unsaved: true, canSave: false });
  });

  it("has nothing to save when the text matches the saved note", () => {
    const draft = lessonWorkspace.noteDraft("Result types", "Result types");
    expect(draft).toMatchObject({ unsaved: false, canSave: false });
  });

  it("can save an edit to a saved note", () => {
    const draft = lessonWorkspace.noteDraft("Result types!", "Result types");
    expect(draft).toMatchObject({ unsaved: true, canSave: true });
  });

  it("allows exactly the limit and refuses one character over", () => {
    const atLimit = lessonWorkspace.noteDraft(
      "a".repeat(MAX_NOTE_LENGTH),
      null
    );
    expect(atLimit).toMatchObject({ tooLong: false, canSave: true });

    const over = lessonWorkspace.noteDraft(
      "a".repeat(MAX_NOTE_LENGTH + 1),
      null
    );
    expect(over).toMatchObject({
      length: MAX_NOTE_LENGTH + 1,
      tooLong: true,
      canSave: false,
    });
  });
});
