import Drawer from "../Drawer";
import TypeArea from "../TypeArea";
import createPersistedState from "use-persisted-state";
import { Document, IDocument, IDocumentsState } from "../../models/Document";
import { useSelector } from "../../predux/store";
import { selectUser } from "../../predux/user/user.selectors";
import { db } from "../../utils/firebase";
import { useEffect, useState } from "react";
import Spinner from "../Spinner";

const useDocumentState = createPersistedState("documents");

const startingDoc = new Document();

const initialDocumentState = {
  docs: { [startingDoc.ObjectId]: startingDoc },
  currentDoc: startingDoc.ObjectId,
};

function useDocuments() {
  const user = useSelector(selectUser);
  const [docs, setDocs] = useState<IDocumentsState>(initialDocumentState);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      if (!user) return;
      const docs = await db.ref(`documents/${user.uid}`).once("value");

      if (docs.exists()) {
        setDocs(docs.val() as IDocumentsState);
      }
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return setLoading(false);
    setLoading(true);
    fetchDocuments();
  }, [user]);

  return { docs, loading, fetchDocuments };
}

const Editor = () => {
  const user = useSelector(selectUser);
  const { docs: docState, loading, fetchDocuments } = useDocuments();

  const currentDoc = docState.docs[docState.currentDoc];

  const setDocument = async (id: string, document: Partial<IDocument>) => {
    try {
      if (user) {
        await db.ref(`documents/${user.uid}/docs/${id}`).set(document);
        await db.ref(`documents/${user.uid}/currentDoc`).set(id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <Spinner />;
  return (
    <>
      <Drawer
        docState={docState}
        setDocument={setDocument}
        fetchDocuments={fetchDocuments}
      />
      <TypeArea doc={currentDoc} setDocument={setDocument} />
    </>
  );
};

export default Editor;
