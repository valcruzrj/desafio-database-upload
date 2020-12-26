"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

class CreateTransactions1593377034798 {
  async up(queryRunner) {
    await queryRunner.createTable(new _typeorm.Table({
      name: 'transactions',
      columns: [{
        name: 'id',
        type: 'uuid',
        isPrimary: true,
        generationStrategy: 'uuid',
        default: 'uuid_generate_v4()'
      }, {
        name: 'title',
        type: 'varchar'
      }, {
        name: 'type',
        type: 'varchar'
      }, {
        name: 'value',
        type: 'decimal',
        precision: 10,
        scale: 2
      }, {
        name: 'created_at',
        type: 'timestamp',
        default: 'now()'
      }, {
        name: 'updated_at',
        type: 'timestamp',
        default: 'now()'
      }]
    }));
  }

  async down(queryRunner) {
    await queryRunner.dropTable('transactions');
  }

}

exports.default = CreateTransactions1593377034798;