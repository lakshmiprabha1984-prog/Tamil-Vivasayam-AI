CREATE TABLE "community_posts" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"author_name" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"category" text DEFAULT 'General' NOT NULL,
	"likes" integer DEFAULT 0 NOT NULL,
	"replies_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_replies" (
	"id" text PRIMARY KEY NOT NULL,
	"post_id" text NOT NULL,
	"user_id" text NOT NULL,
	"author_name" text NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "crops" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"name" text NOT NULL,
	"variety" text,
	"planted_date" text,
	"farm_name" text,
	"health_score" integer DEFAULT 100 NOT NULL,
	"location" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "disease_history" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"crop_id" text,
	"crop_name" text NOT NULL,
	"disease_name" text NOT NULL,
	"confidence" double precision NOT NULL,
	"severity" text NOT NULL,
	"affected_area_pct" double precision NOT NULL,
	"description" text NOT NULL,
	"cause" text,
	"organic_treatment" text,
	"chemical_treatment" text,
	"recommended_fertilizer" text,
	"spray_interval" text,
	"safety_measures" text,
	"recovery_time" text,
	"image_url" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "market_prices" (
	"id" text PRIMARY KEY NOT NULL,
	"crop_name" text NOT NULL,
	"market_name" text NOT NULL,
	"price" double precision NOT NULL,
	"unit" text NOT NULL,
	"trend" text DEFAULT 'stable' NOT NULL,
	"price_date" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"message" text NOT NULL,
	"type" text NOT NULL,
	"is_read" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "predictions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"crop" text NOT NULL,
	"location" text NOT NULL,
	"temperature" double precision NOT NULL,
	"humidity" double precision NOT NULL,
	"rainfall" double precision NOT NULL,
	"growth_stage" text NOT NULL,
	"disease_risk" text NOT NULL,
	"expected_outbreak" text NOT NULL,
	"risk_level" text NOT NULL,
	"prevention_tips" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "recovery_monitoring" (
	"id" text PRIMARY KEY NOT NULL,
	"disease_history_id" text NOT NULL,
	"image_url" text NOT NULL,
	"status" text NOT NULL,
	"recovery_pct" double precision NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"action" text NOT NULL,
	"details" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"uid" text PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password_hash" text,
	"name" text,
	"role" text DEFAULT 'farmer' NOT NULL,
	"farm_name" text,
	"district" text,
	"village" text,
	"phone" text,
	"language" text DEFAULT 'ta' NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "community_posts" ADD CONSTRAINT "community_posts_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_replies" ADD CONSTRAINT "community_replies_post_id_community_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."community_posts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "community_replies" ADD CONSTRAINT "community_replies_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crops" ADD CONSTRAINT "crops_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disease_history" ADD CONSTRAINT "disease_history_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disease_history" ADD CONSTRAINT "disease_history_crop_id_crops_id_fk" FOREIGN KEY ("crop_id") REFERENCES "public"."crops"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "recovery_monitoring" ADD CONSTRAINT "recovery_monitoring_disease_history_id_disease_history_id_fk" FOREIGN KEY ("disease_history_id") REFERENCES "public"."disease_history"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_logs" ADD CONSTRAINT "user_logs_user_id_users_uid_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("uid") ON DELETE no action ON UPDATE no action;