const express = require('express');
const router = express.Router();

router.get('/me', (req, res) => {
    res.json({ id: "demo-user-id", name: "Demo User", role: "CITIZEN" });
});

module.exports = router;
