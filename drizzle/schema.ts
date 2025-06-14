import { pgTable, integer, text, boolean, date, varchar, unique } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const todo = pgTable("todo", {
	id: integer().primaryKey().notNull(),
	text: text().notNull(),
	done: boolean().default(false).notNull(),
});

export const phone = pgTable("phone", {
	phoneId: integer().primaryKey().generatedAlwaysAsIdentity({ name: ""phone_phoneId_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	phoneNumber: text(),
	label: text(),
	contactId: integer(),
	ordinal: integer(),
});

export const contact = pgTable("contact", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "contact_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
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
	noteId: integer().primaryKey().generatedAlwaysAsIdentity({ name: ""note_noteId_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	noteText: varchar({ length: 1000 }),
	createdOn: date(),
	relatedDate: date(),
});

export const noteMapping = pgTable("noteMapping", {
	noteMappingid: integer().primaryKey().generatedAlwaysAsIdentity({ name: ""noteMapping_noteMappingid_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	noteId: integer(),
	contactId: integer(),
});

export const users = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "users_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	email: varchar({ length: 255 }).notNull(),
}, (table) => [
	unique("users_email_unique").on(table.email),
]);

export const email = pgTable("email", {
	emailId: integer().primaryKey().generatedAlwaysAsIdentity({ name: ""email_emailId_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	email: text(),
	label: text(),
	contactId: integer(),
	ordinal: integer(),
});

export const address = pgTable("address", {
	addressId: integer().primaryKey().generatedAlwaysAsIdentity({ name: ""address_addressId_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	addressText: text(),
	ordinal: integer(),
	label: text(),
	contactId: integer(),
});
