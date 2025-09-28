import { integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const example = sqliteTable("example", {
  id: integer("id").primaryKey({ autoIncrement: true }),
});
