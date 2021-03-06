import { useState } from "react";
import { Document, IDocument, IDocumentsState } from "../../models/Document";
import { debounce } from "../../utils/debounce";
import classes from "./Drawer.module.scss";
import { ItemInterface, ReactSortable } from "react-sortablejs";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { mapOrder } from "../../utils/mapOrder";
import { db } from "../../utils/firebase";
import { useSelector } from "../../predux/store";
import { selectUser } from "../../predux/user/user.selectors";
import copy from "copy-to-clipboard";
import useToast from "../../hooks/useToast";

interface Props {
  docState: IDocumentsState;
  setDocument: (id: string, document: Partial<IDocument>) => Promise<void>;
  fetchDocuments: () => Promise<void>;
}

const Drawer: React.FC<Props> = ({ docState, setDocument, fetchDocuments }) => {
  const user = useSelector(selectUser);
  const toast = useToast({
    position: {
      x: "left",
      y: "top",
    },
  });
  const { docs } = docState;

  const docArray = Object.values(docs);

  const [order, setOrder] = useLocalStorage(
    "order",
    docArray.map((doc) => ({ id: doc.ObjectId })) as ItemInterface[]
  );

  const handleClick = async () => {
    if (!user) return;
    const newDoc = new Document();
    setDocument(newDoc.ObjectId, newDoc).then(fetchDocuments);
  };

  const setCurrentDoc = async (id: string) => {
    if (!user || docState.currentDoc === id) return;
    try {
      await db.ref(`documents/${user.uid}/currentDoc`).set(id);
      await fetchDocuments();
    } catch (error) {
      console.log(error);
    }
  };

  const setDocumentProps = async (id: string, key: string, value: any) => {
    if (!user) return;
    try {
      await db.ref(`documents/${user.uid}/docs/${id}/${key}`).set(value);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShare = async () => {
    if (!user) return;
    const domain = window.location.origin;
    const url = `${domain}/${user.uid}/${docState.currentDoc}`;
    if ("share" in navigator) {
      const shareData = {
        title: "Silence",
        text: `${docState.docs[docState.currentDoc]?.title} | Silence Document`,
        url: url,
      };
      await navigator.share(shareData);
      return;
    }

    copy(url);
    toast.success("Link copied!");
  };

  // const handleRemove = () => {
  //   const doc = docs[docState.currentDoc];
  //   if (doc) {
  //     const { [doc.ObjectId]: _, ...rest } = { ...docs };

  //     if (!Object.keys(rest).length) {
  //       const newDoc = new Document();
  //       return setDocuments({
  //         ...docState,
  //         docs: { [newDoc.ObjectId]: newDoc },
  //         currentDoc: newDoc.ObjectId,
  //       });
  //     }
  //     setDocuments({
  //       ...docState,
  //       docs: rest,
  //       currentDoc: Object.values(rest)[0].ObjectId,
  //     });
  //   }
  // };

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
          // onClick={handleRemove}
        >
          <i className="far fa-trash-alt"></i>
        </div>
        <div className={classes.drawerItem} onClick={handleShare}>
          <i className="fas fa-share-square"></i>
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
            setDocumentProps={setDocumentProps}
            setCurrentDoc={setCurrentDoc}
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
  setCurrentDoc: (id: string) => Promise<void>;
  setDocumentProps: (id: string, key: string, value: any) => Promise<void>;
}

const DocumentListItem = ({
  doc,
  setCurrentDoc,
  current,
  setDocumentProps,
}: DocListItemProps) => {
  const [title, setTitle] = useState(doc.title);

  const updateDocumentTitle = debounce(
    (title: string) => setDocumentProps(doc.ObjectId, "title", title),
    50
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    updateDocumentTitle(e.target.value);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setCurrentDoc(doc.ObjectId);
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
