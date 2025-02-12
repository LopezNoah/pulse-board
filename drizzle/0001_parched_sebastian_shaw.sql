PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (CURRENT_DATE) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_DATE) NOT NULL,
	`project_id` integer NOT NULL,
	`description` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_activities`("id", "created_at", "updated_at", "project_id", "description") SELECT "id", "created_at", "updated_at", "project_id", "description" FROM `activities`;--> statement-breakpoint
DROP TABLE `activities`;--> statement-breakpoint
ALTER TABLE `__new_activities` RENAME TO `activities`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_phases` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (CURRENT_DATE) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_DATE) NOT NULL,
	`project_id` integer NOT NULL,
	`name` text NOT NULL,
	`status` text NOT NULL,
	`order` integer NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_phases`("id", "created_at", "updated_at", "project_id", "name", "status", "order") SELECT "id", "created_at", "updated_at", "project_id", "name", "status", "order" FROM `phases`;--> statement-breakpoint
DROP TABLE `phases`;--> statement-breakpoint
ALTER TABLE `__new_phases` RENAME TO `phases`;--> statement-breakpoint
CREATE TABLE `__new_projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (CURRENT_DATE) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_DATE) NOT NULL,
	`name` text NOT NULL,
	`start_date` text NOT NULL,
	`user_id` integer,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_projects`("id", "created_at", "updated_at", "name", "start_date", "user_id") SELECT "id", "created_at", "updated_at", "name", "start_date", "user_id" FROM `projects`;--> statement-breakpoint
DROP TABLE `projects`;--> statement-breakpoint
ALTER TABLE `__new_projects` RENAME TO `projects`;--> statement-breakpoint
CREATE TABLE `__new_tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (CURRENT_DATE) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_DATE) NOT NULL,
	`project_id` integer NOT NULL,
	`title` text NOT NULL,
	`status` text NOT NULL,
	`priority` text NOT NULL,
	FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_tasks`("id", "created_at", "updated_at", "project_id", "title", "status", "priority") SELECT "id", "created_at", "updated_at", "project_id", "title", "status", "priority" FROM `tasks`;--> statement-breakpoint
DROP TABLE `tasks`;--> statement-breakpoint
ALTER TABLE `__new_tasks` RENAME TO `tasks`;--> statement-breakpoint
CREATE TABLE `__new_users` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (CURRENT_DATE) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_DATE) NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_users`("id", "created_at", "updated_at", "name", "email") SELECT "id", "created_at", "updated_at", "name", "email" FROM `users`;--> statement-breakpoint
DROP TABLE `users`;--> statement-breakpoint
ALTER TABLE `__new_users` RENAME TO `users`;--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);