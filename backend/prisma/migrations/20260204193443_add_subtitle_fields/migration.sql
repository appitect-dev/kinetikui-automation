-- CreateTable
CREATE TABLE "Video" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "compositionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "caption" TEXT,
    "hashtags" TEXT,
    "props" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "filePath" TEXT,
    "thumbnailPath" TEXT,
    "scheduledFor" DATETIME,
    "postedAt" DATETIME,
    "instagramId" TEXT,
    "error" TEXT,
    "script" TEXT,
    "voiceoverPath" TEXT,
    "subtitles" TEXT,
    "subtitlesEnabled" BOOLEAN NOT NULL DEFAULT true,
    "subtitlesSrtPath" TEXT,
    "subtitlesVttPath" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PostMetrics" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "videoId" TEXT NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "saves" INTEGER NOT NULL DEFAULT 0,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "reach" INTEGER NOT NULL DEFAULT 0,
    "engagement" REAL NOT NULL DEFAULT 0.0,
    "fetchedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Settings" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT 'default',
    "instagramAccessToken" TEXT,
    "instagramAccountId" TEXT,
    "postingTimes" TEXT NOT NULL DEFAULT '09:00,14:00,19:00',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Video_status_idx" ON "Video"("status");

-- CreateIndex
CREATE INDEX "Video_scheduledFor_idx" ON "Video"("scheduledFor");

-- CreateIndex
CREATE INDEX "PostMetrics_videoId_idx" ON "PostMetrics"("videoId");
