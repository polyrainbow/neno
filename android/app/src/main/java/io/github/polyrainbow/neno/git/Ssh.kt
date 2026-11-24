package io.github.polyrainbow.neno.git

import org.apache.sshd.common.NamedResource
import org.apache.sshd.common.config.keys.KeyUtils
import org.apache.sshd.common.config.keys.PublicKeyEntry
import org.apache.sshd.common.config.keys.writer.openssh.OpenSSHKeyPairResourceWriter
import org.apache.sshd.common.keyprovider.KeyPairProvider
import org.apache.sshd.common.util.security.SecurityUtils
import org.eclipse.jgit.api.TransportConfigCallback
import org.eclipse.jgit.transport.CredentialsProvider
import org.eclipse.jgit.transport.SshTransport
import org.eclipse.jgit.transport.URIish
import org.eclipse.jgit.transport.sshd.ServerKeyDatabase
import org.eclipse.jgit.transport.sshd.SshdSessionFactory
import org.eclipse.jgit.transport.sshd.SshdSessionFactoryBuilder
import java.io.ByteArrayOutputStream
import java.io.File
import java.net.InetSocketAddress
import java.security.KeyPair
import java.security.PublicKey

/**
 * Encrypts secrets at rest. On the device: a key in the Android
 * Keystore, which never leaves it (KeystoreSecretBox). In unit tests:
 * nothing at all.
 */
interface SecretBox {
  fun seal(plain: ByteArray): ByteArray
  fun open(sealed: ByteArray): ByteArray
}

/**
 * This device's SSH identity: an ed25519 key pair, made on first use.
 * The private key is kept sealed by a SecretBox and only ever opened in
 * memory; JGit gets the KeyPair object, never a key file.
 */
class SshIdentity(private val sshDir: File, private val box: SecretBox) {
  private val sealedKey get() = File(sshDir, "id_ed25519.sealed")
  private val publicKeyFile get() = File(sshDir, "id_ed25519.pub")
  private val replacedMarker get() = File(sshDir, "id_ed25519.replaced")

  @Volatile
  private var cached: KeyPair? = null

  @Synchronized
  fun keyPair(): KeyPair {
    cached?.let { return it }
    val keyPair = if (sealedKey.exists()) loadOrReplace() else generate()
    cached = keyPair
    return keyPair
  }

  /*
    Uninstalling with "Keep app data" keeps the sealed key but not the
    Keystore key that sealed it: Android wipes an app's Keystore entries
    with the app. The old key cannot be opened again, so the device gets
    a new one, and is marked until a sync shows the server accepts it.
  */
  private fun loadOrReplace(): KeyPair = try {
    load()
  } catch (_: Exception) {
    generate().also { replacedMarker.writeText("") }
  }

  /** The key was replaced and the server has not accepted the new one yet. */
  fun wasReplaced(): Boolean {
    keyPair()
    return replacedMarker.exists()
  }

  /** A sync went through: the server knows the current key. */
  fun confirmAccepted() {
    if (replacedMarker.exists()) replacedMarker.delete()
  }

  /** The line to add to the server's authorized_keys. */
  fun publicKeyLine(): String {
    keyPair()
    return publicKeyFile.readText().trim()
  }

  private fun generate(): KeyPair {
    sshDir.mkdirs()
    val keyPair = KeyUtils.generateKeyPair(KeyPairProvider.SSH_ED25519, 256)
    val openSsh = ByteArrayOutputStream().also {
      OpenSSHKeyPairResourceWriter.INSTANCE
        .writePrivateKey(keyPair, "neno", null, it)
    }.toByteArray()
    sealedKey.writeBytes(box.seal(openSsh))
    publicKeyFile.writeText(PublicKeyEntry.toString(keyPair.public) + " neno\n")
    return keyPair
  }

  private fun load(): KeyPair {
    val openSsh = box.open(sealedKey.readBytes())
    return SecurityUtils.loadKeyPairIdentities(
      null,
      NamedResource.ofName("neno"),
      openSsh.inputStream(),
      null,
    ).first()
  }
}

/**
 * The servers this device trusts, one line per "host:port" with the
 * key's OpenSSH public key line. Trust on first use, but never silently:
 * an unknown host is refused, and its key remembered so the UI can show
 * the fingerprint and ask. A key that differs from the trusted one is
 * refused outright.
 */
class TrustedHosts(private val file: File) : ServerKeyDatabase {

  /** What an unknown host presented in the last refused handshake. */
  private val presented = mutableMapOf<String, PublicKey>()
  private val changed = mutableSetOf<String>()

  companion object {
    fun hostKeyFor(url: String): String {
      val uri = URIish(url)
      val port = if (uri.port > 0) uri.port else 22
      return "${uri.host}:$port"
    }

    fun fingerprint(key: PublicKey): String = KeyUtils.getFingerPrint(key)
  }

  private fun hostKey(address: InetSocketAddress, connectAddress: String): String {
    // connectAddress is "host" or "[host]:port", as written in the URL.
    val host = connectAddress.removePrefix("[").substringBefore("]")
      .substringBefore(":").ifEmpty { address.hostString }
    return "$host:${address.port}"
  }

  @Synchronized
  private fun read(): Map<String, String> {
    if (!file.exists()) return emptyMap()
    return file.readLines()
      .mapNotNull { line ->
        val space = line.indexOf(' ')
        if (space <= 0) null else line.substring(0, space) to line.substring(space + 1)
      }
      .toMap()
  }

  @Synchronized
  fun trust(host: String, key: PublicKey) {
    val entries = read().toMutableMap()
    entries[host] = PublicKeyEntry.toString(key)
    file.parentFile?.mkdirs()
    file.writeText(entries.entries.joinToString("") { "${it.key} ${it.value}\n" })
    presented.remove(host)
    changed.remove(host)
  }

  @Synchronized
  fun presentedKey(host: String): PublicKey? = presented[host]

  @Synchronized
  fun hasChanged(host: String): Boolean = host in changed

  @Synchronized
  fun isTrusted(host: String): Boolean = host in read()

  override fun lookup(
    connectAddress: String,
    remoteAddress: InetSocketAddress,
    config: ServerKeyDatabase.Configuration,
  ): List<PublicKey> {
    val line = read()[hostKey(remoteAddress, connectAddress)] ?: return emptyList()
    return listOf(PublicKeyEntry.parsePublicKeyEntry(line).resolvePublicKey(null, null, null))
  }

  @Synchronized
  override fun accept(
    connectAddress: String,
    remoteAddress: InetSocketAddress,
    serverKey: PublicKey,
    config: ServerKeyDatabase.Configuration,
    provider: CredentialsProvider?,
  ): Boolean {
    val host = hostKey(remoteAddress, connectAddress)
    val trusted = lookup(connectAddress, remoteAddress, config)
    if (trusted.isEmpty()) {
      presented[host] = serverKey
      return false
    }
    if (trusted.any { KeyUtils.compareKeys(it, serverKey) }) return true
    changed.add(host)
    return false
  }
}

/** JGit's SSH transport, set up for this device's identity and hosts. */
class SshSupport(
  homeDir: File,
  val identity: SshIdentity,
  val trustedHosts: TrustedHosts,
) {
  private val sshDir = File(homeDir, ".ssh")

  companion object {
    /*
      ConnectTimeout only covers the TCP connect. A server that accepts
      the connection and then never speaks SSH — a captive portal, a
      half-dead NAS — would hold every fetch and push for MINA's default
      of two minutes. Apache MINA SSHD reads its defaults from system
      properties prefixed "org.apache.sshd.config.".
    */
    private const val HANDSHAKE_TIMEOUT_MS = "20000"

    init {
      System.setProperty("org.apache.sshd.config.auth-timeout", HANDSHAKE_TIMEOUT_MS)
    }
  }

  init {
    /*
      Never wait long for a server that is not there — a LAN-only remote
      is unreachable whenever the phone is elsewhere — and notice a dead
      connection instead of hanging on it.
    */
    sshDir.mkdirs()
    File(sshDir, "config").writeText(
      """
      Host *
        ConnectTimeout 5
        ServerAliveInterval 15
        ServerAliveCountMax 2
        PreferredAuthentications publickey
      """.trimIndent() + "\n",
    )
  }

  private val factory: SshdSessionFactory = SshdSessionFactoryBuilder()
    .setHomeDirectory(homeDir)
    .setSshDirectory(sshDir)
    .setConfigFile { File(it, "config") }
    .setPreferredAuthentications("publickey")
    .setDefaultKeysProvider { listOf(identity.keyPair()) }
    .setServerKeyDatabase { _, _ -> trustedHosts }
    .build(null)

  val transport = TransportConfigCallback { transport ->
    (transport as? SshTransport)?.sshSessionFactory = factory
  }

  fun close() = factory.close()
}
