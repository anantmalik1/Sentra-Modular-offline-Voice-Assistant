import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  role: text('role').default('Commander').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Tasks table (scoped to user_id)
export const tasks = sqliteTable('tasks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  time: text('time').notNull(),
  priority: text('priority').default('Normal').notNull(),
  status: text('status').default('Active').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Timeline tasks table (Mission timeline items scoped to user_id)
export const timelineTasks = sqliteTable('timeline_tasks', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  time: text('time').notNull(),
  title: text('title').notNull(),
  status: text('status').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false).notNull(),
  orderIdx: integer('order_idx').default(0).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Conversations table (voice / text transcript history scoped to user_id)
export const conversations = sqliteTable('conversations', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  transcript: text('transcript').notNull(),
  intent: text('intent').default('GENERAL'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Memory entries table (cognitive vector memory & user knowledge scoped to user_id)
export const memoryEntries = sqliteTable('memory_entries', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  key: text('key').notNull(),
  value: text('value').notNull(),
  category: text('category').default('general').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});

// Agent status table (Active/Standby status per agent per user)
export const agentStatuses = sqliteTable('agent_statuses', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  agentId: text('agent_id').notNull(), // coding, research, memory, browser, task, system
  name: text('name').notNull(),
  role: text('role').notNull(),
  status: text('status').default('Standby').notNull(), // 'Active' | 'Standby'
  progress: integer('progress').default(50).notNull(),
  color: text('color').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// LLM Connections table (per-user provider settings and status)
export const llmConnections = sqliteTable('llm_connections', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  providerId: text('provider_id').notNull(), // claude, openai, gemini, groq, etc.
  name: text('name').notNull(),
  apiKeyEncrypted: text('api_key_encrypted'),
  status: text('status').default('Not Linked').notNull(), // 'Connected' | 'Not Linked' | 'No Models'
  connected: integer('connected', { mode: 'boolean' }).default(false).notNull(),
  color: text('color').notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

// Feed activities table (Live Intelligence Feed entries scoped to user_id)
export const feedActivities = sqliteTable('feed_activities', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description').notNull(),
  tag: text('tag').default('INFO').notNull(), // 'INFO' | 'WARN' | 'TIP' | 'LIVE'
  time: text('time').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
});
