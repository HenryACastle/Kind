import { integer, pgTable, varchar, text, boolean, date } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
});


export const contact = pgTable("contact", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	firstName: text(),
	middleName: text(),
	lastName: text(),
	phone: integer(),
	archive: boolean().default(false).notNull(),
	suffix: text(),
	mnemonic: text(),
	nickname: text(),
	email: integer(),
	googleResourceName: text(),
	birthDate: date(),

});



export const note = pgTable("note", {
	noteId: integer().primaryKey().generatedAlwaysAsIdentity(),
	noteText: varchar({ length: 1000 }),
	createdOn: date(),
	relatedDate: date(),
});

export const noteMapping = pgTable("noteMapping", {
	noteMappingid: integer().primaryKey().generatedAlwaysAsIdentity(),
	noteId: integer(),
	contactId: integer(),
});
