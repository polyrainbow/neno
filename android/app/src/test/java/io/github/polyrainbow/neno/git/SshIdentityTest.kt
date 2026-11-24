package io.github.polyrainbow.neno.git

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertNotEquals
import org.junit.Assert.assertTrue
import org.junit.Rule
import org.junit.Test
import org.junit.rules.TemporaryFolder
import javax.crypto.AEADBadTagException

class SshIdentityTest {
  @get:Rule
  val temp = TemporaryFolder()

  /* What KeystoreSecretBox does once Android wiped its Keystore key. */
  private object ForgetfulBox : SecretBox {
    override fun seal(plain: ByteArray) = plain
    override fun open(sealed: ByteArray): ByteArray = throw AEADBadTagException()
  }

  @Test
  fun keepsItsKeyAcrossRestarts() {
    val dir = temp.newFolder(".ssh")
    val first = SshIdentity(dir, PlainBox).publicKeyLine()
    val again = SshIdentity(dir, PlainBox)
    assertEquals(first, again.publicKeyLine())
    assertFalse(again.wasReplaced())
    assertTrue(first.startsWith("ssh-ed25519 "))
  }

  @Test
  fun makesANewKeyWhenTheSealedOneCannotBeOpened() {
    val dir = temp.newFolder(".ssh")
    val old = SshIdentity(dir, PlainBox).publicKeyLine()

    val reinstalled = SshIdentity(dir, ForgetfulBox)

    assertNotEquals(old, reinstalled.publicKeyLine())
    assertTrue(reinstalled.wasReplaced())
    reinstalled.confirmAccepted()
    assertFalse(reinstalled.wasReplaced())
  }
}
