export type ISongsDocument = {
  commentCount?: number;
  displayUserName?: string;
  documentId: string;
  modifiedName?: string;
  originalName?: string;
  songGenre?: string;
  songUrl?: string;
  uid?: string;
};

export type InputUpdateSongValues = {
  modifiedName: string;
  songGenre: string;
};

export type ISongDocumentWithOutId = Omit<ISongsDocument, "documentId">;

export type ICommentDocument = {
  content?: string;
  datePosted?: string;
  documentId: string;
  songId?: string;
  uid?: string;
  userName?: string;
};
