const router = require("express").Router();
// Import controllers
const { getAccount, updateAccount, deleteAccount } = require("../controllers/user.controller");
// Import middlewares
const { verifyToken } = require("../middlewares/auth.middleware");

router
    .route("/user/me")
    .get(verifyToken, getAccount)
    .put(verifyToken, updateAccount)
    .delete(verifyToken, deleteAccount);

module.exports = router;
