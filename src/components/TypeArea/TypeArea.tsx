import classes from "./TypeArea.module.scss";
import Quill, { QuillOptionsStatic, Sources } from "quill";
import Delta from "quill-delta";
import { debounce } from "../../utils/debounce";
import ReactQuill from "react-quill";
import { IDocument } from "../../models/Document";

interface Props {
  doc: IDocument;
  setDocument: (id: string, document: Partial<IDocument>) => void;
  readonly?: boolean;
}

type HandleChange = (
  value: string,
  delta: Delta,
  source: Sources,
  editor: Quill
) => void;

const TypeArea: React.FC<Props> = ({ doc, setDocument, readonly }) => {
  const handleChange = debounce<HandleChange>(
    (_, __, source, editor: Quill) => {
      if (source !== "user") return;
      setDocument(doc.ObjectId, {
        ...doc,
        contents: editor.getContents(),
      });
    },
    100
  );

  return (
    <div className={classes.typeArea}>
      <ReactQuill
        readOnly={readonly}
        className={classes.editor}
        {...quillOptions}
        value={doc.contents as any}
        onChange={handleChange}
      />
    </div>
  );
};

export default TypeArea;

const quillOptions: QuillOptionsStatic = {
  theme: "bubble",
  placeholder: "Compose an epic...",
  modules: {
    toolbar: [
      "bold",
      "italic",
      "underline",
      "strike",
      { header: 1 },
      { header: 2 },
      { header: 3 },
      { header: 4 },
      { list: "ordered" },
      { list: "bullet" },
      // "task-list",
      { list: "check" },
    ],
    // "task-list": true,
  },
};
