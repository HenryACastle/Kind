import { pgTable, integer, text, boolean, date, varchar, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const todo = pgTable("todo", {
	id: integer().primaryKey().notNull(),
	text: text().notNull(),
	done: boolean().default(false).notNull(),
});

export const phone = pgTable("phone", {
	phoneId: integer().primaryKey().generatedAlwaysAsIdentity(),
	phoneNumber: text(),
	label: text(),
	contactId: integer(),
	ordinal: integer(),
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
	birthMonthDate: text(),
	createdOn: date(),
	summary: varchar({ length: 1000 }),
	introducedBy: text(),
	website: text(),
	linkedin: text(),
	instagram: text(),
	twitter: text(),
	jobTitle: text(),
	company: text(),
	mainNationality: text(),
	secondaryNationality: text(),
	birthYear: text(),
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

export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	email: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const email = pgTable("email", {
	emailId: integer().primaryKey().generatedAlwaysAsIdentity(),
	email: text(),
	label: text(),
	contactId: integer(),
	ordinal: integer(),
});

export const address = pgTable("address", {
	addressId: integer().primaryKey().generatedAlwaysAsIdentity(),
	addressText: text(),
	ordinal: integer(),
	label: text(),
	contactId: integer(),
});
