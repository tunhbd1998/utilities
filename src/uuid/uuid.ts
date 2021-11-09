import * as uuid from "uuid";
const uuidValidate = require("uuid-validate");

export class Uuid {
  static generateV1() {
    return uuid.v1();
  }

  static generateV4() {
    return uuid.v4();
  }

  static isValid(uuid: string) {
    return uuidValidate(uuid);
  }
}
