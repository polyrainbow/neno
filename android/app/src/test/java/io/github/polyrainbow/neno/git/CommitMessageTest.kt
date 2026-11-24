package io.github.polyrainbow.neno.git

import org.junit.Assert.assertEquals
import org.junit.Test

/** Holds CommitMessage to src/lib/git/commitMessage.ts. */
class CommitMessageTest {
  @Test
  fun formatsSingleChanges() {
    assertEquals("create: a", CommitMessage.format(listOf("a.subtext"), emptyList(), emptyList()))
    assertEquals("update: a", CommitMessage.format(emptyList(), listOf("a.subtext"), emptyList()))
    assertEquals("delete: a", CommitMessage.format(emptyList(), emptyList(), listOf("a.subtext")))
    assertEquals(
      "create file: files/x.png",
      CommitMessage.format(listOf("files/x.png"), emptyList(), emptyList()),
    )
    assertEquals("update", CommitMessage.format(emptyList(), emptyList(), emptyList()))
  }

  @Test
  fun summarizesSeveralChanges() {
    assertEquals(
      "update: 2 notes, 1 file\n\n+ a.subtext\n~ files/x.png\n- b.subtext",
      CommitMessage.format(listOf("a.subtext"), listOf("files/x.png"), listOf("b.subtext")),
    )
    assertEquals(
      "delete: 2 notes\n\n- a.subtext\n- b.subtext",
      CommitMessage.format(emptyList(), emptyList(), listOf("a.subtext", "b.subtext")),
    )
    assertEquals(
      "create: 1 note, 2 files\n\n+ a.subtext\n+ x\n+ y",
      CommitMessage.format(listOf("a.subtext", "x", "y"), emptyList(), emptyList()),
    )
  }
}
