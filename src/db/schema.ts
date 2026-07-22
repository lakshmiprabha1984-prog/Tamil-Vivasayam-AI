import { pgTable, text, timestamp, boolean, doublePrecision, integer } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Define the 'users' table (uses Firebase Auth UID as primary key for convenience and seamless auth linkage)
export const users = pgTable('users', {
  uid: text('uid').primaryKey(),
  email: text('email').notNull(),
  passwordHash: text('password_hash'), // For email/password authentication (encrypted password storage)
  name: text('name'),
  role: text('role').default('farmer').notNull(), // 'farmer' | 'msme' | 'admin'
  farmName: text('farm_name'),
  district: text('district'),
  village: text('village'),
  phone: text('phone'),
  language: text('language').default('ta').notNull(), // 'ta' | 'en' | 'hi' | 'te' | 'kn' | 'ml'
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'crops' table (Crop Passport)
export const crops = pgTable('crops', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  name: text('name').notNull(), // e.g., Paddy (நெல்), Tomato (தக்காளி)
  variety: text('variety'),
  plantedDate: text('planted_date'),
  farmName: text('farm_name'),
  healthScore: integer('health_score').default(100).notNull(),
  location: text('location'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'disease_history' table
export const diseaseHistory = pgTable('disease_history', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  cropId: text('crop_id').references(() => crops.id),
  cropName: text('crop_name').notNull(),
  diseaseName: text('disease_name').notNull(),
  confidence: doublePrecision('confidence').notNull(),
  severity: text('severity').notNull(), // 'Low' | 'Medium' | 'High' | 'Severe'
  affectedAreaPct: doublePrecision('affected_area_pct').notNull(),
  description: text('description').notNull(),
  cause: text('cause'),
  organicTreatment: text('organic_treatment'),
  chemicalTreatment: text('chemical_treatment'),
  recommendedFertilizer: text('recommended_fertilizer'),
  sprayInterval: text('spray_interval'),
  safetyMeasures: text('safety_measures'),
  recoveryTime: text('recovery_time'),
  imageUrl: text('image_url').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'recovery_monitoring' table
export const recoveryMonitoring = pgTable('recovery_monitoring', {
  id: text('id').primaryKey(),
  diseaseHistoryId: text('disease_history_id').references(() => diseaseHistory.id).notNull(),
  imageUrl: text('image_url').notNull(),
  status: text('status').notNull(), // 'Improved' | 'Stable' | 'Worsened'
  recoveryPct: doublePrecision('recovery_pct').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'predictions' table (Disease Outbreak Risk Prediction)
export const predictions = pgTable('predictions', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  crop: text('crop').notNull(),
  location: text('location').notNull(),
  temperature: doublePrecision('temperature').notNull(),
  humidity: doublePrecision('humidity').notNull(),
  rainfall: doublePrecision('rainfall').notNull(),
  growthStage: text('growth_stage').notNull(),
  diseaseRisk: text('disease_risk').notNull(),
  expectedOutbreak: text('expected_outbreak').notNull(),
  riskLevel: text('risk_level').notNull(), // 'Low' | 'Medium' | 'High'
  preventionTips: text('prevention_tips').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'notifications' table
export const notifications = pgTable('notifications', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  title: text('title').notNull(),
  message: text('message').notNull(),
  type: text('type').notNull(), // 'disease' | 'weather' | 'scheme' | 'system'
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'user_logs' table (stores user logs, predictions, profile updates)
export const userLogs = pgTable('user_logs', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.uid),
  action: text('action').notNull(), // 'LOGIN', 'REGISTER', 'PREDICT', 'UPLOAD_LEAF', 'COMPARE_IMAGE', 'UPDATE_PROFILE'
  details: text('details'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'community_posts' table
export const communityPosts = pgTable('community_posts', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.uid).notNull(),
  authorName: text('author_name').notNull(),
  title: text('title').notNull(),
  content: text('content').notNull(),
  category: text('category').default('General').notNull(), // 'Paddy' | 'Tomato' | 'Organic' | 'General'
  likes: integer('likes').default(0).notNull(),
  repliesCount: integer('replies_count').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'community_replies' table
export const communityReplies = pgTable('community_replies', {
  id: text('id').primaryKey(),
  postId: text('post_id').references(() => communityPosts.id, { onDelete: 'cascade' }).notNull(),
  userId: text('user_id').references(() => users.uid).notNull(),
  authorName: text('author_name').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Define the 'market_prices' table
export const marketPrices = pgTable('market_prices', {
  id: text('id').primaryKey(),
  cropName: text('crop_name').notNull(),
  marketName: text('market_name').notNull(),
  price: doublePrecision('price').notNull(), // price per unit
  unit: text('unit').notNull(), // 'kg' | 'Quintal' | 'Bag (50kg)'
  trend: text('trend').default('stable').notNull(), // 'up' | 'down' | 'stable'
  priceDate: text('price_date').notNull(), // YYYY-MM-DD
  createdAt: timestamp('created_at').defaultNow(),
});

// Declare Relations for ease of Drizzle queries
export const usersRelations = relations(users, ({ many }) => ({
  crops: many(crops),
  diseaseHistories: many(diseaseHistory),
  predictions: many(predictions),
  notifications: many(notifications),
  logs: many(userLogs),
  communityPosts: many(communityPosts),
  communityReplies: many(communityReplies),
}));

export const communityPostsRelations = relations(communityPosts, ({ one, many }) => ({
  author: one(users, {
    fields: [communityPosts.userId],
    references: [users.uid],
  }),
  replies: many(communityReplies),
}));

export const communityRepliesRelations = relations(communityReplies, ({ one }) => ({
  post: one(communityPosts, {
    fields: [communityReplies.postId],
    references: [communityPosts.id],
  }),
  author: one(users, {
    fields: [communityReplies.userId],
    references: [users.uid],
  }),
}));

export const cropsRelations = relations(crops, ({ one, many }) => ({
  owner: one(users, {
    fields: [crops.userId],
    references: [users.uid],
  }),
  diseaseHistories: many(diseaseHistory),
}));

export const diseaseHistoryRelations = relations(diseaseHistory, ({ one, many }) => ({
  user: one(users, {
    fields: [diseaseHistory.userId],
    references: [users.uid],
  }),
  crop: one(crops, {
    fields: [diseaseHistory.cropId],
    references: [crops.id],
  }),
  recoveryMonitorings: many(recoveryMonitoring),
}));

export const recoveryMonitoringRelations = relations(recoveryMonitoring, ({ one }) => ({
  diseaseHistory: one(diseaseHistory, {
    fields: [recoveryMonitoring.diseaseHistoryId],
    references: [diseaseHistory.id],
  }),
}));
