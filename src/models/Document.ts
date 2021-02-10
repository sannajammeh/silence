import Delta from "quill-delta";
import shortid from "shortid";

export class Document implements IDocument {
  ObjectId: string;
  contents: Delta;
  title: string;
  created_at: Date;
  constructor(
    ObjectId = shortid.generate(),
    delta: Delta = new Delta(),
    title = "My Document",
    created_at = new Date()
  ) {
    this.ObjectId = ObjectId;
    this.contents = delta;
    this.title = title;
    this.created_at = created_at;
  }
}

export interface IDocument {
  ObjectId: string;
  contents: Delta;
  title: string;
  created_at: Date;
  current?: boolean;
}
export interface IDocumentsState {
  docs: Record<string, IDocument>;
  currentDoc: string;
}
