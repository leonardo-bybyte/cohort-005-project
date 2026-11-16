import { useState } from "react";
import { useFetcher } from "react-router";
import { Lock, MessageSquare, NotebookPen } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Textarea } from "~/components/ui/textarea";
import {
  CommentThread,
  type RenderedComment,
} from "~/components/comment-thread";
import { lessonWorkspace, type WorkspaceTab } from "~/modules/lesson-workspace";
import { cn, formatRelativeTime } from "~/lib/utils";

type SavedNote = { body: string; updatedAt: string } | null;

export function LessonWorkspace({
  note,
  comments,
  currentUserId,
  canModerate,
  instructorName,
}: {
  note: SavedNote;
  comments: RenderedComment[];
  currentUserId: number | null;
  canModerate: boolean;
  instructorName: string;
}) {
  const signedIn = currentUserId !== null;

  return (
    <Card className="mb-8 gap-0 py-0">
      <Tabs defaultValue={lessonWorkspace.openingTab(note !== null)}>
        <WorkspaceTabs
          discussionLabel={lessonWorkspace.discussionLabel(comments)}
          showNotes={signedIn}
        />

        <CardContent className="p-6">
          {/* Kept mounted so a half-written note or comment survives a tab switch. */}
          <TabsContent
            value={"discussion" satisfies WorkspaceTab}
            forceMount
            className="data-[state=inactive]:hidden"
          >
            <CommentThread
              comments={comments}
              currentUserId={currentUserId}
              canModerate={canModerate}
              canPost
              instructorName={instructorName}
            />
          </TabsContent>
          {signedIn && (
            <TabsContent
              value={"notes" satisfies WorkspaceTab}
              forceMount
              className="data-[state=inactive]:hidden"
            >
              <NoteEditor note={note} />
            </TabsContent>
          )}
        </CardContent>
      </Tabs>
    </Card>
  );
}

function WorkspaceTabs({
  discussionLabel,
  showNotes,
}: {
  discussionLabel: string;
  showNotes: boolean;
}) {
  return (
    <div className="border-b px-6 pt-4">
      <TabsList className="h-auto gap-6 bg-transparent p-0">
        <WorkspaceTabTrigger value="discussion">
          <MessageSquare />
          {discussionLabel}
        </WorkspaceTabTrigger>
        {showNotes && (
          <WorkspaceTabTrigger value="notes">
            <NotebookPen />
            My notes
          </WorkspaceTabTrigger>
        )}
      </TabsList>
    </div>
  );
}

function WorkspaceTabTrigger({
  value,
  children,
}: {
  value: WorkspaceTab;
  children: React.ReactNode;
}) {
  return (
    <TabsTrigger
      value={value}
      className="-mb-px rounded-none border-0 border-b-2 border-transparent px-0 pb-3 text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-foreground data-[state=active]:shadow-none"
    >
      {children}
    </TabsTrigger>
  );
}

function NoteEditor({ note }: { note: SavedNote }) {
  const fetcher = useFetcher<{ ok: boolean; error?: string }>();
  const [body, setBody] = useState(note?.body ?? "");
  const isSaving = fetcher.state !== "idle";
  const error = fetcher.data?.error;
  const draft = lessonWorkspace.noteDraft(body, note?.body ?? null);

  return (
    <fetcher.Form method="post" className="space-y-2">
      <input type="hidden" name="intent" value="save-note" />
      <Textarea
        name="body"
        value={body}
        onChange={(event) => setBody(event.target.value)}
        rows={6}
        placeholder="Jot down what you want to remember from this lesson..."
        aria-label="My notes"
        className="resize-y"
      />

      <div className="flex items-center gap-3">
        <Button type="submit" size="sm" disabled={isSaving || !draft.canSave}>
          {isSaving ? "Saving..." : "Save note"}
        </Button>

        <NoteStatus error={error} note={note} unsaved={draft.unsaved} />

        <span
          className={cn(
            "ml-auto text-xs",
            draft.tooLong ? "text-destructive" : "text-muted-foreground"
          )}
        >
          {draft.length} / {draft.max}
        </span>
      </div>

      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Lock className="size-3" />
        Only you can see your notes.
      </p>
    </fetcher.Form>
  );
}

function NoteStatus({
  error,
  note,
  unsaved,
}: {
  error: string | undefined;
  note: SavedNote;
  unsaved: boolean;
}) {
  if (error) return <span className="text-sm text-destructive">{error}</span>;
  if (!note) return null;

  return (
    <span suppressHydrationWarning className="text-xs text-muted-foreground">
      {unsaved ? "Unsaved changes · " : ""}
      Last saved {formatRelativeTime(note.updatedAt)}
    </span>
  );
}
