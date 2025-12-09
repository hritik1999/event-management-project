"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AdminController_1 = require("../controllers/AdminController");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get("/stats", auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(["ADMIN"]), AdminController_1.AdminController.getStats);
exports.default = router;
