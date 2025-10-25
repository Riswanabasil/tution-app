"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TopicService = void 0;
class TopicService {
    constructor(topicRepo) {
        this.topicRepo = topicRepo;
    }
    create(data) {
        return this.topicRepo.create(data);
    }
    getByModule(moduleId) {
        return this.topicRepo.findByModule(moduleId);
    }
    getById(id) {
        return this.topicRepo.findById(id);
    }
    update(id, data) {
        return this.topicRepo.update(id, data);
    }
    delete(id) {
        return this.topicRepo.delete(id);
    }
}
exports.TopicService = TopicService;
