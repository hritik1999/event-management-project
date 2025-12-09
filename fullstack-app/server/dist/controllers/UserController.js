"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const UserService_1 = require("../services/UserService");
const userService = new UserService_1.UserService();
class UserController {
    static getPendingOrganizers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield userService.getPendingOrganizers();
                res.status(200).json(users);
            }
            catch (error) {
                res.status(500).json({ message: error.message });
            }
        });
    }
    static approveOrganizer(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield userService.approveOrganizer(req.params.id);
                res.status(200).json(user);
            }
            catch (error) {
                res.status(404).json({ message: error.message });
            }
        });
    }
}
exports.UserController = UserController;
