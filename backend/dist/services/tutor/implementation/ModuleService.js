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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TutorModuleService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class TutorModuleService {
    constructor(moduleRepo) {
        this.moduleRepo = moduleRepo;
    }
    listByCourse(courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.moduleRepo.findByCourse(courseId);
        });
    }
    createModule(courseId, name, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.moduleRepo.create({
                courseId: new mongoose_1.default.Types.ObjectId(courseId),
                name,
                order,
            });
        });
    }
    getById(courseId, moduleId) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.moduleRepo.findByModule(courseId, moduleId);
        });
    }
    updateModule(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.moduleRepo.update(id, data);
        });
    }
    deleteModule(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.moduleRepo.softDelete(id);
        });
    }
}
exports.TutorModuleService = TutorModuleService;
