import { useState } from "react";
import { Document, IDocument, IDocumentsState } from "../../models/Document";
import { debounce } from "../../utils/debounce";
import classes from "./Drawer.module.scss";
import { ItemInterface, ReactSortable } from "react-sortablejs";
import createPersistedState from "use-persisted-state";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { mapOrder } from "../../utils/mapOrder";

interface Props {
  docState: IDocumentsState;
  setDocument: (id: string, document: Partial<IDocument>) => void;
  setDocuments: React.Dispatch<React.SetStateAction<IDocumentsState>>;
}

const useOrder = createPersistedState("order");

const Drawer: React.FC<Props> = ({ docState, setDocument, setDocuments }) => {
  const { docs } = docState;

  const docArray = Object.values(docs);

  const [order, setOrder] = useLocalStorage(
    "order",
    docArray.map((doc) => ({ id: doc.ObjectId })) as ItemInterface[]
  );

  const handleClick = () => {
    const newDoc = new Document();
    setDocuments({
      ...docState,
      docs: { ...docState.docs, [newDoc.ObjectId]: newDoc },
    });
  };

  const handleRemove = () => {
    const doc = docs[docState.currentDoc];
    if (doc) {
      const { [doc.ObjectId]: _, ...rest } = { ...docs };

      if (!Object.keys(rest).length) {
        const newDoc = new Document();
        return setDocuments({
          ...docState,
          docs: { [newDoc.ObjectId]: newDoc },
          currentDoc: newDoc.ObjectId,
        });
      }
      setDocuments({
        ...docState,
        docs: rest,
        currentDoc: Object.values(rest)[0].ObjectId,
      });
    }
  };

  const orderedDocArray = mapOrder<typeof docArray>(
    docArray,
    order.map((o) => o.id),
    "ObjectId"
  ).map((o) => ({ ...o, id: o.ObjectId }));

  return (
    <div className={classes.drawer}>
      <div className={classes.actions}>
        <div
          className={classes.drawerItem}
          onClick={handleClick}
          id="plus-button"
        >
          <i className="fas fa-plus"></i>
        </div>
        <div
          className={classes.drawerItem}
          id="delete-button"
          onClick={handleRemove}
        >
          <i className="far fa-trash-alt"></i>
        </div>
      </div>
      <ReactSortable
        list={orderedDocArray}
        setList={setOrder}
        className={classes.documentList}
      >
        {orderedDocArray.map((doc) => (
          <DocumentListItem
            current={doc.ObjectId === docState.currentDoc}
            key={doc.ObjectId}
            doc={doc}
            setDocument={setDocument}
            setDocuments={setDocuments}
          />
        ))}
      </ReactSortable>
    </div>
  );
};

export default Drawer;

interface DocListItemProps {
  current: boolean;
  doc: IDocument;
  setDocument: Props["setDocument"];
  setDocuments: Props["setDocuments"];
}

const DocumentListItem = ({
  doc,
  setDocument,
  setDocuments,
  current,
}: DocListItemProps) => {
  const [title, setTitle] = useState(doc.title);

  const updateDocumentTitle = debounce(
    (title: string) => setDocument(doc.ObjectId, { title }),
    50
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    updateDocumentTitle(e.target.value);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setDocuments((prev) => ({ ...prev, currentDoc: doc.ObjectId }));
  };

  const activeStyles = {
    color: "lightblue",
    fontWeight: 500,
  };

  return (
    <div
      className={classes.documentListItem}
      style={current ? activeStyles : undefined}
      onClick={current ? undefined : handleClick}
    >
      &#8227;
      {current ? (
        <input
          className={classes.unstyled}
          value={title}
          data-id={doc.ObjectId}
          onChange={handleChange}
        />
      ) : (
        <span style={{ marginLeft: 10 }}>{doc.title}</span>
      )}
    </div>
  );
};
