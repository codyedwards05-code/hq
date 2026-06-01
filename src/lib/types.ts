export type EntityType = "PROJECT" | "IDEA" | "PERSON" | "CONVERSATION" | "KNOWLEDGE" | "ASSET";

export type ProjectStatus = "ACTIVE" | "PAUSED" | "COMPLETED" | "ARCHIVED";
export type IdeaStatus = "IDEA" | "RESEARCHING" | "VALIDATING" | "BUILDING" | "ARCHIVED";
export type ConversationSource =
  | "CHATGPT"
  | "CLAUDE"
  | "MEETING"
  | "PHONE_CALL"
  | "VOICE_MEMO"
  | "TEXT_MESSAGE"
  | "EMAIL"
  | "OTHER";
export type KnowledgeCategory =
  | "BUSINESS"
  | "AI"
  | "MARKETING"
  | "SALES"
  | "FAITH"
  | "PERSONAL_DEVELOPMENT"
  | "OPERATIONS"
  | "TECHNOLOGY"
  | "OTHER";
export type AssetType =
  | "DOCUMENT"
  | "SPREADSHEET"
  | "IMAGE"
  | "VIDEO"
  | "WEBSITE"
  | "GITHUB_REPO"
  | "PDF"
  | "OTHER";

export interface TimelineEvent {
  id: string;
  entityType: EntityType;
  entityId: string;
  entityTitle?: string | null;
  action: string;
  description: string;
  metadata?: string | null;
  createdAt: string | Date;
}

export interface SearchResult {
  id: string;
  type: EntityType;
  title: string;
  subtitle?: string;
  url: string;
}
