-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('CLERK', 'LOCAL');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'YEARLY');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('INCOMPLETE', 'INCOMPLETE_EXPIRED', 'TRIALING', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'UNPAID', 'PAUSED');

-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('FREE', 'PRO', 'STUDIO');

-- CreateEnum
CREATE TYPE "PaymentKind" AS ENUM ('SUBSCRIPTION', 'CREDIT_PACK');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('STRIPE', 'PAYPAL');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "CreditTransactionType" AS ENUM ('PURCHASE', 'SUBSCRIPTION_GRANT', 'GENERATION_USE', 'BONUS', 'REFUND', 'ADMIN_ADJUSTMENT');

-- CreateEnum
CREATE TYPE "BodyPlacement" AS ENUM ('ARM', 'FOREARM', 'WRIST', 'HAND', 'CHEST', 'BACK', 'SHOULDER', 'LEG', 'THIGH', 'CALF', 'ANKLE', 'FOOT', 'NECK', 'RIBCAGE', 'OTHER');

-- CreateEnum
CREATE TYPE "AspectRatio" AS ENUM ('SQUARE', 'PORTRAIT', 'LANDSCAPE', 'WIDE');

-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "UploadType" AS ENUM ('REFERENCE', 'BODY_PHOTO');

-- CreateEnum
CREATE TYPE "TattooSource" AS ENUM ('GENERATED', 'UPLOADED', 'GALLERY', 'PRESET');

-- CreateEnum
CREATE TYPE "BlendMode" AS ENUM ('NORMAL', 'MULTIPLY', 'SCREEN', 'OVERLAY', 'SOFT_LIGHT', 'HARD_LIGHT', 'DARKEN', 'LIGHTEN');

-- CreateEnum
CREATE TYPE "TryOnStatus" AS ENUM ('DRAFT', 'SAVED', 'EXPORTED', 'SHARED');

-- CreateEnum
CREATE TYPE "UsageAction" AS ENUM ('GENERATION', 'TRY_ON', 'DOWNLOAD_HD', 'CREDIT_PURCHASE', 'SUBSCRIPTION_CHECKOUT');

-- CreateEnum
CREATE TYPE "StripeWebhookEventStatus" AS ENUM ('PROCESSING', 'PROCESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "TattooStyleName" AS ENUM ('GEOMETRIC', 'WATERCOLOR', 'MINIMALIST', 'TRADITIONAL', 'JAPANESE', 'BLACKWORK', 'NEO_TRADITIONAL', 'DOTWORK', 'TRIBAL', 'REALISM', 'ABSTRACT', 'LETTERING', 'FINELINE', 'ILLUSTRATIVE');

-- CreateEnum
CREATE TYPE "TattooCategory" AS ENUM ('ANIMAL', 'FLORAL', 'SYMBOL', 'PORTRAIT', 'NATURE', 'MYTHOLOGY', 'RELIGIOUS', 'MEMORIAL', 'QUOTE', 'ABSTRACT', 'SKULL', 'BUTTERFLY', 'DRAGON', 'WOLF', 'LION', 'ROSE', 'CROSS', 'ANCHOR', 'COMPASS', 'MANDALA');

-- CreateEnum
CREATE TYPE "AudienceType" AS ENUM ('MEN', 'WOMEN', 'UNISEX');

-- CreateEnum
CREATE TYPE "PostStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "imageUrl" TEXT,
    "authProvider" "AuthProvider" NOT NULL DEFAULT 'CLERK',
    "passwordHash" TEXT,
    "refreshTokenHash" TEXT,
    "lastLoginAt" TIMESTAMP(3),
    "stripeCustomerId" TEXT,
    "paypalPayerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentProvider" "PaymentProvider" NOT NULL DEFAULT 'STRIPE',
    "stripeCustomerId" TEXT,
    "stripeSubscriptionId" TEXT,
    "stripePriceId" TEXT,
    "stripeProductId" TEXT,
    "paypalSubscriptionId" TEXT,
    "paypalPlanId" TEXT,
    "paypalPayerId" TEXT,
    "billingCycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "status" "SubscriptionStatus" NOT NULL,
    "tier" "SubscriptionTier" NOT NULL,
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3) NOT NULL,
    "cancelAtPeriodEnd" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "subscriptionId" TEXT,
    "provider" "PaymentProvider" NOT NULL DEFAULT 'STRIPE',
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "stripeInvoiceId" TEXT,
    "stripeChargeId" TEXT,
    "paypalOrderId" TEXT,
    "paypalCaptureId" TEXT,
    "paypalSubscriptionId" TEXT,
    "paypalPayerId" TEXT,
    "amount" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'usd',
    "status" "PaymentStatus" NOT NULL,
    "kind" "PaymentKind" NOT NULL,
    "description" TEXT,
    "creditsAmount" INTEGER NOT NULL DEFAULT 0,
    "receiptUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "credit_ledger" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "paymentId" TEXT,
    "amount" INTEGER NOT NULL,
    "balance" INTEGER NOT NULL,
    "type" "CreditTransactionType" NOT NULL,
    "description" TEXT,
    "generationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tattoo_generations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "negativePrompt" TEXT,
    "styleId" TEXT NOT NULL,
    "placement" "BodyPlacement",
    "aspectRatio" "AspectRatio" NOT NULL DEFAULT 'SQUARE',
    "referenceImageUrl" TEXT,
    "status" "GenerationStatus" NOT NULL DEFAULT 'PENDING',
    "creditsUsed" INTEGER NOT NULL DEFAULT 1,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "tattoo_generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "generation_images" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "size" INTEGER NOT NULL,
    "isUpscaled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generation_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tattoo_styles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "promptPrefix" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tattoo_styles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_uploads" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "type" "UploadType" NOT NULL,
    "filename" TEXT NOT NULL,
    "size" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_uploads_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "try_on_projects" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "bodyPhotoId" TEXT NOT NULL,
    "bodyPhotoUrl" TEXT NOT NULL,
    "tattooImageUrl" TEXT NOT NULL,
    "tattooSource" "TattooSource" NOT NULL DEFAULT 'GENERATED',
    "positionX" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "positionY" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "scale" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "rotation" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "opacity" DOUBLE PRECISION NOT NULL DEFAULT 0.85,
    "blendMode" "BlendMode" NOT NULL DEFAULT 'MULTIPLY',
    "flipX" BOOLEAN NOT NULL DEFAULT false,
    "flipY" BOOLEAN NOT NULL DEFAULT false,
    "resultUrl" TEXT,
    "resultPublicId" TEXT,
    "status" "TryOnStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "try_on_projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usage_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" "UsageAction" NOT NULL,
    "units" INTEGER NOT NULL DEFAULT 1,
    "success" BOOLEAN NOT NULL DEFAULT true,
    "generationId" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "stripe_webhook_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "StripeWebhookEventStatus" NOT NULL DEFAULT 'PROCESSING',
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "stripe_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paypal_webhook_events" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" "StripeWebhookEventStatus" NOT NULL DEFAULT 'PROCESSING',
    "error" TEXT,
    "attempts" INTEGER NOT NULL DEFAULT 1,
    "processedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "paypal_webhook_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tattoos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "style" "TattooStyleName" NOT NULL,
    "placement" "BodyPlacement",
    "category" "TattooCategory" NOT NULL,
    "meanings" TEXT[],
    "audience" "AudienceType" NOT NULL DEFAULT 'UNISEX',
    "tags" TEXT[],
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "likeCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "artistName" TEXT,
    "artistUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tattoos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_posts" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "featuredImage" TEXT,
    "seoTitle" TEXT,
    "seoDescription" TEXT,
    "status" "PostStatus" NOT NULL DEFAULT 'DRAFT',
    "publishedAt" TIMESTAMP(3),
    "authorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "testimonials" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT,
    "avatar" TEXT,
    "content" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 5,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "oldValue" TEXT,
    "newValue" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_stripeCustomerId_key" ON "users"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "users_paypalPayerId_key" ON "users"("paypalPayerId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_userId_key" ON "subscriptions"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeCustomerId_key" ON "subscriptions"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_stripeSubscriptionId_key" ON "subscriptions"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "subscriptions_paypalSubscriptionId_key" ON "subscriptions"("paypalSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeCheckoutSessionId_key" ON "payments"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripePaymentIntentId_key" ON "payments"("stripePaymentIntentId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeInvoiceId_key" ON "payments"("stripeInvoiceId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_stripeChargeId_key" ON "payments"("stripeChargeId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_paypalOrderId_key" ON "payments"("paypalOrderId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_paypalCaptureId_key" ON "payments"("paypalCaptureId");

-- CreateIndex
CREATE INDEX "payments_userId_createdAt_idx" ON "payments"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "credit_ledger_userId_createdAt_idx" ON "credit_ledger"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "tattoo_generations_userId_createdAt_idx" ON "tattoo_generations"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "tattoo_generations_status_idx" ON "tattoo_generations"("status");

-- CreateIndex
CREATE UNIQUE INDEX "tattoo_styles_name_key" ON "tattoo_styles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tattoo_styles_slug_key" ON "tattoo_styles"("slug");

-- CreateIndex
CREATE INDEX "user_uploads_userId_idx" ON "user_uploads"("userId");

-- CreateIndex
CREATE INDEX "try_on_projects_userId_idx" ON "try_on_projects"("userId");

-- CreateIndex
CREATE INDEX "try_on_projects_userId_status_idx" ON "try_on_projects"("userId", "status");

-- CreateIndex
CREATE INDEX "favorites_userId_idx" ON "favorites"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_generationId_key" ON "favorites"("userId", "generationId");

-- CreateIndex
CREATE INDEX "usage_logs_userId_action_createdAt_idx" ON "usage_logs"("userId", "action", "createdAt");

-- CreateIndex
CREATE INDEX "usage_logs_ipAddress_action_createdAt_idx" ON "usage_logs"("ipAddress", "action", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "tattoos_slug_key" ON "tattoos"("slug");

-- CreateIndex
CREATE INDEX "tattoos_style_idx" ON "tattoos"("style");

-- CreateIndex
CREATE INDEX "tattoos_placement_idx" ON "tattoos"("placement");

-- CreateIndex
CREATE INDEX "tattoos_category_idx" ON "tattoos"("category");

-- CreateIndex
CREATE INDEX "tattoos_audience_idx" ON "tattoos"("audience");

-- CreateIndex
CREATE INDEX "tattoos_isPublic_isFeatured_idx" ON "tattoos"("isPublic", "isFeatured");

-- CreateIndex
CREATE INDEX "tattoos_tags_idx" ON "tattoos"("tags");

-- CreateIndex
CREATE UNIQUE INDEX "blog_posts_slug_key" ON "blog_posts"("slug");

-- CreateIndex
CREATE INDEX "blog_posts_status_publishedAt_idx" ON "blog_posts"("status", "publishedAt");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_key_key" ON "feature_flags"("key");

-- CreateIndex
CREATE INDEX "audit_logs_userId_createdAt_idx" ON "audit_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entity_entityId_idx" ON "audit_logs"("entity", "entityId");

-- AddForeignKey
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_subscriptionId_fkey" FOREIGN KEY ("subscriptionId") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "credit_ledger" ADD CONSTRAINT "credit_ledger_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "payments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tattoo_generations" ADD CONSTRAINT "tattoo_generations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tattoo_generations" ADD CONSTRAINT "tattoo_generations_styleId_fkey" FOREIGN KEY ("styleId") REFERENCES "tattoo_styles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generation_images" ADD CONSTRAINT "generation_images_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "tattoo_generations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_uploads" ADD CONSTRAINT "user_uploads_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "try_on_projects" ADD CONSTRAINT "try_on_projects_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "try_on_projects" ADD CONSTRAINT "try_on_projects_bodyPhotoId_fkey" FOREIGN KEY ("bodyPhotoId") REFERENCES "user_uploads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "favorites" ADD CONSTRAINT "favorites_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "tattoo_generations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
