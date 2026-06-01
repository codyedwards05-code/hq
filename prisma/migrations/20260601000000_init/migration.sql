-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "startDate" TIMESTAMP(3),
    "coverImage" TEXT,
    "notes" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Idea" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "problemSolved" TEXT,
    "opportunity" TEXT,
    "notes" TEXT,
    "status" TEXT NOT NULL DEFAULT 'IDEA',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Idea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Person" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "jobTitle" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "linkedin" TEXT,
    "notes" TEXT,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Person_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'OTHER',
    "date" TIMESTAMP(3),
    "url" TEXT,
    "transcript" TEXT,
    "notes" TEXT,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Knowledge" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "tags" TEXT NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Knowledge_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asset" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL DEFAULT 'OTHER',
    "url" TEXT,
    "filePath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectIdea" (
    "projectId" TEXT NOT NULL,
    "ideaId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectIdea_pkey" PRIMARY KEY ("projectId","ideaId")
);

-- CreateTable
CREATE TABLE "ProjectPerson" (
    "projectId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectPerson_pkey" PRIMARY KEY ("projectId","personId")
);

-- CreateTable
CREATE TABLE "ProjectConversation" (
    "projectId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectConversation_pkey" PRIMARY KEY ("projectId","conversationId")
);

-- CreateTable
CREATE TABLE "ProjectAsset" (
    "projectId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectAsset_pkey" PRIMARY KEY ("projectId","assetId")
);

-- CreateTable
CREATE TABLE "ProjectKnowledge" (
    "projectId" TEXT NOT NULL,
    "knowledgeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectKnowledge_pkey" PRIMARY KEY ("projectId","knowledgeId")
);

-- CreateTable
CREATE TABLE "IdeaPerson" (
    "ideaId" TEXT NOT NULL,
    "personId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdeaPerson_pkey" PRIMARY KEY ("ideaId","personId")
);

-- CreateTable
CREATE TABLE "IdeaConversation" (
    "ideaId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdeaConversation_pkey" PRIMARY KEY ("ideaId","conversationId")
);

-- CreateTable
CREATE TABLE "IdeaAsset" (
    "ideaId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdeaAsset_pkey" PRIMARY KEY ("ideaId","assetId")
);

-- CreateTable
CREATE TABLE "IdeaKnowledge" (
    "ideaId" TEXT NOT NULL,
    "knowledgeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IdeaKnowledge_pkey" PRIMARY KEY ("ideaId","knowledgeId")
);

-- CreateTable
CREATE TABLE "PersonConversation" (
    "personId" TEXT NOT NULL,
    "conversationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PersonConversation_pkey" PRIMARY KEY ("personId","conversationId")
);

-- CreateTable
CREATE TABLE "ConversationAsset" (
    "conversationId" TEXT NOT NULL,
    "assetId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationAsset_pkey" PRIMARY KEY ("conversationId","assetId")
);

-- CreateTable
CREATE TABLE "ConversationKnowledge" (
    "conversationId" TEXT NOT NULL,
    "knowledgeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConversationKnowledge_pkey" PRIMARY KEY ("conversationId","knowledgeId")
);

-- CreateTable
CREATE TABLE "TimelineEvent" (
    "id" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "entityTitle" TEXT,
    "action" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimelineEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimelineEvent_entityType_entityId_idx" ON "TimelineEvent"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "TimelineEvent_createdAt_idx" ON "TimelineEvent"("createdAt");

-- AddForeignKey
ALTER TABLE "ProjectIdea" ADD CONSTRAINT "ProjectIdea_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectIdea" ADD CONSTRAINT "ProjectIdea_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectPerson" ADD CONSTRAINT "ProjectPerson_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectPerson" ADD CONSTRAINT "ProjectPerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectConversation" ADD CONSTRAINT "ProjectConversation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectConversation" ADD CONSTRAINT "ProjectConversation_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectAsset" ADD CONSTRAINT "ProjectAsset_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectAsset" ADD CONSTRAINT "ProjectAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ProjectKnowledge" ADD CONSTRAINT "ProjectKnowledge_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectKnowledge" ADD CONSTRAINT "ProjectKnowledge_knowledgeId_fkey" FOREIGN KEY ("knowledgeId") REFERENCES "Knowledge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "IdeaPerson" ADD CONSTRAINT "IdeaPerson_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IdeaPerson" ADD CONSTRAINT "IdeaPerson_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "IdeaConversation" ADD CONSTRAINT "IdeaConversation_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IdeaConversation" ADD CONSTRAINT "IdeaConversation_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "IdeaAsset" ADD CONSTRAINT "IdeaAsset_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IdeaAsset" ADD CONSTRAINT "IdeaAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "IdeaKnowledge" ADD CONSTRAINT "IdeaKnowledge_ideaId_fkey" FOREIGN KEY ("ideaId") REFERENCES "Idea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "IdeaKnowledge" ADD CONSTRAINT "IdeaKnowledge_knowledgeId_fkey" FOREIGN KEY ("knowledgeId") REFERENCES "Knowledge"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "PersonConversation" ADD CONSTRAINT "PersonConversation_personId_fkey" FOREIGN KEY ("personId") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PersonConversation" ADD CONSTRAINT "PersonConversation_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConversationAsset" ADD CONSTRAINT "ConversationAsset_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConversationAsset" ADD CONSTRAINT "ConversationAsset_assetId_fkey" FOREIGN KEY ("assetId") REFERENCES "Asset"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ConversationKnowledge" ADD CONSTRAINT "ConversationKnowledge_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ConversationKnowledge" ADD CONSTRAINT "ConversationKnowledge_knowledgeId_fkey" FOREIGN KEY ("knowledgeId") REFERENCES "Knowledge"("id") ON DELETE CASCADE ON UPDATE CASCADE;
