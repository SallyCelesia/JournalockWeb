import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaLock } from "react-icons/fa";

import Header from '../Components/Header.jsx'
import Button from '../Components/Button.jsx'
import List from '../Components/List.jsx';

const Entry = () => {
  const { year, month, day } = useParams();

  const [inputText, setInputText] = useState("");
  const [entryContents, setEntryContents] = useState([]);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [passkey, setPasskey] = useState("");
  const [edit, setEdit] = useState(false);
  const [hasPasskey, setHasPasskey] = useState(false);

  /* FETCHING DATA FROM API */
  useEffect(() => {
    fetchEntryData();
  }, [year, month, day]);

  const fetchEntryData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/entries/${year}/${month}/${day}`);
      const data = await response.json();
      
      if (data.success && data.entry && data.entry.entries) {
        const textArray = data.entry.entries.text;
        setEntryContents(textArray);
        setIsEncrypted(data.entry.isEncrypted);
        setHasPasskey(data.hasPasskey);
        setPasskey("");
      }
    }
    catch (error) {
      console.error('Error fetching entry:', error);
    }
  };

  /* SIMPLE ENCRYPTION USING btoa */
  const encryptText = (text, passkey) => {
    try {
      return btoa(text + passkey);
    } 
    catch (error) {
      console.error('Encryption error:', error);
      throw error;
    }
  };

  /* SIMPLE DECRYPTION USING atob */
  const decryptText = (encryptedText, passkey) => {
    try {
      const decoded = atob(encryptedText);
      const originalText = decoded.slice(0, -passkey.length);
      return originalText;
    } 
    catch (error) {
      console.error('Decryption error:', error);
      throw error;
    }
  };

  /* SAVE ENTRY */
  const handleSave = async () => {
    if (isEncrypted) {
      alert("Decrypt the previous entries with your passkey, then save the new entry");
      return;
    }

    if (!inputText.trim()) {
      alert("Empty submissions are not accepted");
      return;
    }

    const updatedEntries = [...entryContents, inputText.trim()];
    setEntryContents(updatedEntries);
    setInputText("");

    try {
      await fetch('http://localhost:5000/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          month,
          day,
          entries: {
            id: Date.now(),
            text: updatedEntries
          },
          isEncrypted: false,
          passkey: passkey || null
        })
      });
    } 
    catch (error) {
      console.error('Error saving entry:', error);
    }
  };

  /* CLEAR ALL JOURNAL ENTRIES */
  const handleClearAll = async () => {
    const confirmClear = window.confirm(
      "Are you sure want to clear all the entries? This will also delete the passkey."
    );

    if (confirmClear === false) return;

    setEntryContents([]);
    setIsEncrypted(false);
    setPasskey("");
    setEdit(false);
    setHasPasskey(false);

    try {
      await fetch(`http://localhost:5000/api/entries/${year}/${month}/${day}`, {
        method: 'DELETE'
      });
    } catch (error) {
      console.log('Error clearing entries:', error);
      alert("error in clearing entries",error);
    }
  };

  /* ENCRYPT / DECRYPT */
  const handleEncryptDecrypt = async () => {
    if (entryContents.length === 0) {
      alert("No entries to encrypt");
      return;
    }

    const enteredPass = prompt(isEncrypted ? "Enter passkey to decrypt" : "Create a passkey to encrypt your entries");
    if (!enteredPass) return;

    /* ENCRYPT */
    if (!isEncrypted) {
      try {
        const encryptedEntries = entryContents.map(text => encryptText(text, enteredPass));

        setEntryContents(encryptedEntries);
        setPasskey(enteredPass);
        setIsEncrypted(true);
        setEdit(false);
        setHasPasskey(true);

        await fetch('http://localhost:5000/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            year,
            month,
            day,
            entries: {
              id: Date.now(),
              text: encryptedEntries
            },
            isEncrypted: true,
            passkey: enteredPass
          })
        });
        
        alert("Entries encrypted successfully! Keep your passkey safe - you'll need it to decrypt.");
      } catch (error) {
        console.error('Error encrypting entry:', error);
        alert('Encryption failed. Please try again.');
      }
    }
    /* DECRYPT */
    else {
      try {
        const verifyResponse = await fetch('http://localhost:5000/api/verify-passkey', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            year,
            month,
            day,
            passkey: enteredPass
          })
        });

        const verifyData = await verifyResponse.json();

        if (!verifyData.success || !verifyData.isMatch) {
          alert("Wrong passkey! Decryption failed.");
          return;
        }

        const decryptedEntries = entryContents.map(encryptedText => 
          decryptText(encryptedText, enteredPass)
        );

        setEntryContents(decryptedEntries);
        setIsEncrypted(false);
        setPasskey(enteredPass);

        const combined = decryptedEntries.join("\n");
        setInputText(combined);
        setEdit(true);

        await fetch('http://localhost:5000/api/entries', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            year,
            month,
            day,
            entries: {
              id: Date.now(),
              text: decryptedEntries
            },
            isEncrypted: false,
            passkey: enteredPass
          })
        });

        alert("Entries decrypted successfully!");
      } 
      catch (error) {
        console.error('Error decrypting entry:', error);
        alert('Decryption failed. Make sure you entered the correct passkey.');
      }
    }
  };

  /* EDIT */
  const handleEdit = () => {
    if (isEncrypted) return;
    const combined = entryContents.join("\n");
    setInputText(combined);
    setEdit(true);
  };

  /* UPDATE */
  const handleUpdate = async () => {
    const updatedTexts = inputText.split("\n").filter(text => text.trim());
    
    setEntryContents(updatedTexts);
    setInputText("");
    setEdit(false);

    try {
      await fetch('http://localhost:5000/api/entries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          year,
          month,
          day,
          entries: {
            id: Date.now(),
            text: updatedTexts
          },
          isEncrypted: false,
          passkey: passkey || null
        })
      });
    } 
    catch (error) {
      console.error('Error updating entry:', error);
    }
  };

  /* RENDER */
  return (
    <>
      <Header/>

      <h2 id="entrydateHeading" style={{ textAlign: "start" }}>
        {month} {day}, {year}
        {hasPasskey && <FaLock style={{ marginLeft: '10px', color: '#ffc107', fontSize: '20px' }} />}
      </h2>

      <form id="form" onSubmit={(e) => e.preventDefault()}>
        <div id="formHeader">
          <div className="saveBtn">
            {!edit ? (
              <Button
                text="Save"
                onClick={handleSave}
                style={{
                  cursor: isEncrypted ? "not-allowed" : "pointer",
                  opacity: isEncrypted ? 0.5 : 1
                }}
              />
            ) : (
              <Button text="Update" onClick={handleUpdate} />
            )}
          </div>
        </div>

        <div className="inputArea">
          <textarea
            id="textArea"
            placeholder="Enter your journal here.."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
        </div>
      </form>

      {/* DISPLAY */}
      <h2 style={{ textAlign: "center", margin: "20px 0px" }}>
        Journal Entries
      </h2>

      <div className="journalDisplay">
        <div id="journalDisplayHeader">
          <Button
            text={isEncrypted ? "Decrypt" : "Encrypt"}
            onClick={handleEncryptDecrypt}
          />

          {!isEncrypted && (
            <Button text="Edit" onClick={handleEdit} />
          )}

          {!isEncrypted && (
            <Button text="Clear All" onClick={handleClearAll} />
          )}
        </div>

        <div id="journalDisplayContents">
          {isEncrypted && (
            <p className="encryptionNotice">
              🔒 Your entries are encrypted. Click "Decrypt" and enter your passkey to view them.
            </p>
          )}
          
          <ul>
            {entryContents.map((entry, index) => (
              <List key={index} listContent={entry} isEncrypted={isEncrypted} />
            ))}
          </ul>
        </div>
      </div>
    </>
  )
}

export default Entry;