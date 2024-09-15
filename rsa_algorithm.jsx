import React, { useState } from 'react';

const RsaEncryptionComponent = () => {
  const [message, setMessage] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [publicKey, setPublicKey] = useState(null);

  const generateKeyPair = async () => {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048, // có thể là 1024, 2048 hoặc 4096
        publicExponent: new Uint8Array([1, 0, 1]),
        hash: "SHA-256",
      },
      true, 
      ["encrypt", "decrypt"]
    );
    setPublicKey(keyPair.publicKey);
  };

  const encryptMessage = async () => {
    if (!publicKey) {
      console.error('Public key is not generated.');
      return;
    }

    const encodedMessage = new TextEncoder().encode(message);
    
    const encryptedArrayBuffer = await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP"
      },
      publicKey,
      encodedMessage
    );

    const encryptedArray = new Uint8Array(encryptedArrayBuffer);
    const encryptedString = Array.from(encryptedArray).map(byte => String.fromCharCode(byte)).join('');
    const encryptedBase64 = window.btoa(encryptedString);

    setEncryptedMessage(encryptedBase64);
  };

  return (
    <div>
      <h2>RSA Encryption with Web Crypto API</h2>
      <button onClick={generateKeyPair}>Generate Key Pair</button>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Enter your message here"
      />
      <button onClick={encryptMessage}>Encrypt</button>
      {encryptedMessage && (
        <div>
          <h3>Encrypted Message:</h3>
          <p>{encryptedMessage}</p>
        </div>
      )}
    </div>
  );
};

export default RsaEncryptionComponent;
