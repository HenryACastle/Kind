import { pgTable, integer, text, boolean, date, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const todo = pgTable("todo", {
	id: integer().primaryKey().notNull(),
	text: text().notNull(),
	done: boolean().default(false).notNull(),
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

export const phone = pgTable("phone", {
	phoneId: integer().primaryKey().generatedAlwaysAsIdentity(),
	phoneNumber: text(),
	label: text(),
	ordinal: text(),
	contactId: text().notNull(),
});

export const note = pgTable("note", {
	noteId: integer().primaryKey().generatedAlwaysAsIdentity(),
	note: varchar(),
	createdOn: date(),
	relatedDate: date(),
});

export const email = pgTable("email", {
	emailId: integer().primaryKey().generatedAlwaysAsIdentity(),
	email: text(),
	label: text(),
	contactId: integer(),
});

export const noteMapping = pgTable("noteMapping", {
	noteMappingid: integer().generatedAlwaysAsIdentity(),
	noteId: integer(),
	contactId: integer(),
});
