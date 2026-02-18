const express = require('express');
const bcrypt = require('bcrypt');
const { readData, writeData } = require('../utils/fileHandler');

const router = express.Router();
const SALT_ROUNDS = 10;


router.get('/entries/:year/:month/:day', (req, res) => {

  const { year, month, day } = req.params;
  const data = readData();
  const yearData = data.journals.find(journal => journal.year === parseInt(year));

  if (!yearData) {
    return res.json({
      success: false,
      message: "Year not found"
    });
  }

  const dayKey = `day_${day}`;
  const entry = yearData.months[month]?.[dayKey];

  if (entry) {
    const { passkeyHash, ...entryWithoutHash } = entry;

    return res.json({
      success: true,
      entry: entryWithoutHash,
      hasPasskey: !!passkeyHash
    });
  }

  res.json({
    success: true,
    entry: {
      entries: { id: null, text: [] },
      isEncrypted: false
    },
    hasPasskey: false
  });

});

router.post('/entries', async (req, res) => {

  try {
    const { year, month, day, entries, isEncrypted, passkey } = req.body;
    const data = readData();

    let yearData = data.journals.find(journal => journal.year === parseInt(year));

    if (!yearData) {
      yearData = {
        year: parseInt(year),
        months: {
          January: {}, February: {}, March: {}, April: {}, May: {}, June: {}, July: {},
          August: {}, September: {}, October: {}, November: {}, December: {}
        }
      };
      data.journals.push(yearData);
    }

    if (!yearData.months) {
      yearData.months = {};
    }

    if (!yearData.months[month]) {
      yearData.months[month] = {};
    }

    let passkeyHash = null;

    if (passkey) {
      passkeyHash = await bcrypt.hash(passkey,SALT_ROUNDS);
    }

    const dayKey = `day_${day}`;

    console.log("Month object:", yearData.months[month]);
    console.log("Day key:", dayKey);

    yearData.months[month][dayKey] = {
      date: `${month} ${day}, ${year}`,
      entries,
      isEncrypted,
      passkeyHash,
      lastModified: new Date().toISOString()
    };

    const success = writeData(data);
    res.json({
      success,
      message: success
        ? "Entry saved"
        : "Save failed"
    });
  } 
  catch (error) {
    console.error("Error saving entry:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

router.post('/verify-passkey', async (req, res) => {

  const { year, month, day, passkey } = req.body;
  const data = readData();
  const yearData = data.journals.find(journal => journal.year === parseInt(year));

  if (!yearData)
    return res.json({ success: false });

  const dayKey = `day_${day}`;
  const entry = yearData.months[month]?.[dayKey];

  if (!entry?.passkeyHash)
    return res.json({ success: false });

  const isMatch = await bcrypt.compare(passkey, entry.passkeyHash);

  res.json({
    success: true,
    isMatch
  });
});


router.delete('/entries/:year/:month/:day', (req, res) => {

  const { year, month, day } = req.params;
  const data = readData();
  const yearData = data.journals.find(journal => journal.year === parseInt(year));

  if (!yearData)
    return res.json({ success: false });

  const dayKey = `day_${day}`;
  delete yearData.months[month]?.[dayKey];
  const success = writeData(data);
  res.json({
    success
  });
});

module.exports = router;