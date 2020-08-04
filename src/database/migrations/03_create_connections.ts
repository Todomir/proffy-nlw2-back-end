import knex from 'knex';
import Knex from 'knex';

export async function up(knex: Knex) {
  return knex.schema.createTable('connections', (table) => {
    table.increments('id').primary();

    table.timestamp('created_at').defaultTo('now()').notNullable();

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
  knex.schema.dropTable('connections');
}
