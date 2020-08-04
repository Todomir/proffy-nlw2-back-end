import knex from 'knex';
import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('classes', (table) => {
    table.string('id').primary();

    table.string('subject').notNullable();
    table.decimal('cost').notNullable();

    table
      .string('user_id')
      .notNullable()
      .references('id')
      .inTable('users')
      .onUpdate('CASCADE')
      .onDelete('CASCADE');
  });
}
export async function down(knex: Knex) {
  knex.schema.dropTable('classes');
}
