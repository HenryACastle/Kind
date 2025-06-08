import { pgTable, integer, text, boolean, date, varchar } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const todo = pgTable("todo", {
	id: integer().primaryKey().notNull(),
	text: text().notNull(),
	done: boolean().default(false).notNull(),
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
	birthDate: date(),
});

export const phone = pgTable("phone", {
	phoneId: integer().primaryKey().generatedAlwaysAsIdentity({ name: ""phone_phoneId_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	phoneNumber: text(),
	label: text(),
	ordinal: text(),
	contactId: text().notNull(),
});

export const note = pgTable("note", {
	noteId: integer().primaryKey().generatedAlwaysAsIdentity({ name: ""note_noteId_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	note: varchar(),
	createdOn: date(),
	relatedDate: date(),
});

export const email = pgTable("email", {
	emailId: integer().primaryKey().generatedAlwaysAsIdentity({ name: ""email_emailId_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	email: text(),
	label: text(),
	contactId: integer(),
});

export const noteMapping = pgTable("noteMapping", {
	noteMappingid: integer().generatedAlwaysAsIdentity({ name: ""noteMapping_noteMappingid_seq"", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647 }),
	noteId: integer(),
	contactId: integer(),
});
