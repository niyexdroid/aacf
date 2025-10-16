-- CreateIndex
CREATE INDEX "Blog_category_idx" ON "public"."Blog"("category");

-- CreateIndex
CREATE INDEX "Blog_createdAt_idx" ON "public"."Blog"("createdAt");

-- CreateIndex
CREATE INDEX "Donor_email_idx" ON "public"."Donor"("email");

-- CreateIndex
CREATE INDEX "Donor_createdAt_idx" ON "public"."Donor"("createdAt");

-- CreateIndex
CREATE INDEX "Donor_paymentStatus_idx" ON "public"."Donor"("paymentStatus");

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "public"."Event"("date");

-- CreateIndex
CREATE INDEX "Event_createdAt_idx" ON "public"."Event"("createdAt");

-- CreateIndex
CREATE INDEX "Feedback_status_idx" ON "public"."Feedback"("status");

-- CreateIndex
CREATE INDEX "Feedback_createdAt_idx" ON "public"."Feedback"("createdAt");

-- CreateIndex
CREATE INDEX "Feedback_email_idx" ON "public"."Feedback"("email");

-- CreateIndex
CREATE INDEX "GalleryImage_eventId_idx" ON "public"."GalleryImage"("eventId");

-- CreateIndex
CREATE INDEX "GalleryImage_createdAt_idx" ON "public"."GalleryImage"("createdAt");

-- CreateIndex
CREATE INDEX "Video_eventId_idx" ON "public"."Video"("eventId");

-- CreateIndex
CREATE INDEX "Video_createdAt_idx" ON "public"."Video"("createdAt");
