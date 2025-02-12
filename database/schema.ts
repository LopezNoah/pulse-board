// db/schema.ts
import { sql, type InferInsertModel, type InferSelectModel } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
import { relations } from "drizzle-orm";

const coreColumns = {
  id: integer("id").primaryKey({ autoIncrement: true }),
  createdAt: text("created_at")
    .default(sql`(CURRENT_DATE)`)
    .notNull(),
  updatedAt: text("updated_at")
    .default(sql`(CURRENT_DATE)`)
    .notNull(),
};

// Users Table
export const users = sqliteTable("users", {
  ...coreColumns,
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
});

export const usersRelations = relations(users, ({ many }) => ({
  projects: many(projects), // A user can have many projects.  This is less common, so it's added but you might not need it.
}));

// Projects Table
export const projects = sqliteTable("projects", {
  ...coreColumns,
  name: text("name").notNull(),
  startDate: text("start_date").notNull(), // ISO string representation
  userId: integer("user_id").references(() => users.id), //Added user_id foreign Key
});

export const projectsRelations = relations(projects, ({ one, many }) => ({
  user: one(users, {
    // A project belongs to one user.
    fields: [projects.userId],
    references: [users.id],
  }),
  phases: many(phases), // A project has many phases.
  tasks: many(tasks), // A project has many tasks.
  activities: many(activities), // A project has many activities.
}));

// Phases Table
export const phases = sqliteTable("phases", {
  ...coreColumns,
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id), // Foreign key to projects
  name: text("name").notNull(),
  status: text("status").notNull(),
  order: integer("order").notNull(),
});

export const phasesRelations = relations(phases, ({ one }) => ({
  project: one(projects, {
    // A phase belongs to one project.
    fields: [phases.projectId],
    references: [projects.id],
  }),
}));

// Tasks Table
export const tasks = sqliteTable("tasks", {
  ...coreColumns,
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id), // Foreign key to projects
  title: text("title").notNull(),
  status: text("status").notNull(),
  priority: text("priority").notNull(),
});

export const tasksRelations = relations(tasks, ({ one }) => ({
  project: one(projects, {
    // A task belongs to one project.
    fields: [tasks.projectId],
    references: [projects.id],
  }),
}));

// Activities Table
export const activities = sqliteTable("activities", {
  ...coreColumns, // createdAt and updatedAt will be added from coreColumns
  projectId: integer("project_id")
    .notNull()
    .references(() => projects.id), // Foreign key to projects
  description: text("description").notNull(),
  // remove created at and update at, use the core columns.
});

export const activitiesRelations = relations(activities, ({ one }) => ({
  project: one(projects, {
    // An activity belongs to one project.
    fields: [activities.projectId],
    references: [projects.id],
  }),
}));

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;
export type Project = InferSelectModel<typeof projects>;
export type NewProject = InferInsertModel<typeof projects>;
export type Phase = InferSelectModel<typeof phases>;
export type NewPhase = InferInsertModel<typeof phases>;
export type Task = InferSelectModel<typeof tasks>;
export type NewTask = InferInsertModel<typeof tasks>;
export type Activity = InferSelectModel<typeof activities>;
export type NewActivity = InferInsertModel<typeof activities>;
