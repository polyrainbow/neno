package io.github.polyrainbow.neno

import android.security.keystore.KeyGenParameterSpec
import android.security.keystore.KeyProperties
import io.github.polyrainbow.neno.git.SecretBox
import java.security.KeyStore
import javax.crypto.Cipher
import javax.crypto.KeyGenerator
import javax.crypto.SecretKey
import javax.crypto.spec.GCMParameterSpec

/**
 * Seals secrets — the SSH private key — with an AES key that lives in
 * the Android Keystore and never leaves it. A copy of the sealed file
 * taken off the device, by a backup or otherwise, cannot be opened.
 *
 * Format: one byte of IV length, the IV, then the AES-GCM ciphertext.
 */
class KeystoreSecretBox(private val alias: String = "neno-ssh-identity") : SecretBox {

  companion object {
    private const val KEYSTORE = "AndroidKeyStore"
    private const val TRANSFORMATION = "AES/GCM/NoPadding"
    private const val TAG_BITS = 128
  }

  private fun key(): SecretKey {
    val keyStore = KeyStore.getInstance(KEYSTORE).apply { load(null) }
    (keyStore.getKey(alias, null) as? SecretKey)?.let { return it }
    val generator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, KEYSTORE)
    generator.init(
      KeyGenParameterSpec.Builder(
        alias,
        KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT,
      )
        .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
        .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
        .setKeySize(256)
        .build(),
    )
    return generator.generateKey()
  }

  override fun seal(plain: ByteArray): ByteArray {
    val cipher = Cipher.getInstance(TRANSFORMATION)
    cipher.init(Cipher.ENCRYPT_MODE, key())
    val iv = cipher.iv
    return byteArrayOf(iv.size.toByte()) + iv + cipher.doFinal(plain)
  }

  override fun open(sealed: ByteArray): ByteArray {
    val ivLength = sealed[0].toInt()
    val iv = sealed.copyOfRange(1, 1 + ivLength)
    val cipher = Cipher.getInstance(TRANSFORMATION)
    cipher.init(Cipher.DECRYPT_MODE, key(), GCMParameterSpec(TAG_BITS, iv))
    return cipher.doFinal(sealed, 1 + ivLength, sealed.size - 1 - ivLength)
  }
}
