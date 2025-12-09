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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class AuthService {
    constructor() {
        this.userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const { username, email, password, role } = data;
            const existingUser = yield this.userRepository.findOne({ where: [{ email }, { username }] });
            if (existingUser) {
                throw new Error("User with this email or username already exists");
            }
            const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
            const user = this.userRepository.create({
                username,
                email,
                password: hashedPassword,
                role: role || User_1.UserRole.ATTENDEE,
                isApproved: role === User_1.UserRole.ORGANIZER ? false : true
            });
            yield this.userRepository.save(user);
            // Return user without password
            const { password: _ } = user, result = __rest(user, ["password"]);
            return result;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.findOne({ where: { email } });
            if (!user) {
                throw new Error("Invalid credentials");
            }
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error("Invalid credentials");
            }
            if (user.role === User_1.UserRole.ORGANIZER && !user.isApproved) {
                throw new Error("Account pending approval");
            }
            const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || "secret", { expiresIn: "10d" } // Updated to 10 days
            );
            const { password: _ } = user, result = __rest(user, ["password"]);
            return { user: result, token };
        });
    }
}
exports.AuthService = AuthService;
