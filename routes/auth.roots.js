const { testReq, register, loginUser } = require("../controllers/auth.controller");
const requireAuth = require("../middleware/permission")

const router = require("express").Router();

// Get /api/auth/test
// Desc : Test Request 
router.get("/test", testReq);
router.post("/register", register)
router.post("/login", loginUser)
router.get("/current", requireAuth, (req, res) => {
    if (!req.user) {
        return res.status(401).json("unAuthorized")
    }
    return res.json(req.user)

})

module.exports = router;

