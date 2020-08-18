"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongodb = require("mongodb");

var _Notifications = _interopRequireDefault(require("../../infra/typeorm/schemas/Notifications"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FakeNotificationsRepository {
  constructor() {
    this.notifications = [];
  }

  async create({
    content,
    recipient_id
  }) {
    const notification = new _Notifications.default();
    Object.assign(notification, {
      id: new _mongodb.ObjectID(),
      content,
      recipient_id
    });
    this.notifications.push(notification);
    return notification;
  }

}

var _default = FakeNotificationsRepository;
exports.default = _default;