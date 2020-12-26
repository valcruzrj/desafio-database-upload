"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _typeorm = require("typeorm");

class AddCategoryIdToTransactions1593378388145 {
  async up(queryRunner) {
    await queryRunner.addColumn('transactions', new _typeorm.TableColumn({
      name: 'category_id',
      type: 'uuid',
      isNullable: true
    }));
    await queryRunner.createForeignKey('transactions', new _typeorm.TableForeignKey({
      columnNames: ['category_id'],
      referencedColumnNames: ['id'],
      referencedTableName: 'categories',
      name: 'TransactionCategory',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    }));
  }

  async down(queryRunner) {
    await queryRunner.dropForeignKey('transactions', 'TransactionCategory');
    await queryRunner.dropColumn('transactions', 'category_id');
  }

}

exports.default = AddCategoryIdToTransactions1593378388145;