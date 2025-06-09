import { integer, pgTable, varchar, text, boolean, date } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	name: varchar({ length: 255 }).notNull(),
	age: integer().notNull(),
	email: varchar({ length: 255 }).notNull().unique(),
});


export const contact = pgTable("contact", {
	id: integer().primaryKey().generatedAlwaysAsIdentity(),
	// Meta Data
	createdOn: date(),
	archive: boolean().default(false).notNull(),

	// Name Information
	firstName: text(),
	middleName: text(),
	lastName: text(),
	suffix: text(),
	nickname: text(),

	// Other Information
	mnemonic: text(),
	summary: varchar({ length: 1000 }),
	introducedBy: text(),

	// Social
	website: text(),
	linkedin: text(),
	instagram: text(),
	twitter: text(),

	// Work Info
	jobTitle: text(),
	company: text(),

	// Other Info
	mainNationality: text(),
	secondaryNationality: text(),

	// Pending Rebuild
	phone: integer(),
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



export const phone = pgTable("phone", {
	phoneId: integer().primaryKey().generatedAlwaysAsIdentity(),
	phoneNumber: text(),
	label: text(),
	ordinal: text(),
	contactId: text().notNull(),
});

export const email = pgTable("email", {
	emailId: integer().primaryKey().generatedAlwaysAsIdentity(),
	email: text(),
	label: text(),
	contactId: integer(),
});

export const todo = pgTable("todo", {
	id: integer().primaryKey().notNull(),
	text: text().notNull(),
	done: boolean().default(false).notNull(),
});
