import Drawer from "./components/Drawer";
import TypeArea from "./components/TypeArea";
import createPersistedState from "use-persisted-state";
import { Document, IDocument, IDocumentsState } from "./models/Document";

const useDocuments = createPersistedState("documents");

const startingDoc = new Document();

const initialDocumentState = {
  docs: { [startingDoc.ObjectId]: startingDoc },
  currentDoc: startingDoc.ObjectId,
};

function App() {
  const [docState, setDocuments] = useDocuments<IDocumentsState>(
    initialDocumentState
  );

  const currentDoc = docState.docs[docState.currentDoc];

  const setDocument = (id: string, document: Partial<IDocument>) => {
    setDocuments((prev) => ({
      ...prev,
      docs: { ...prev.docs, [id]: { ...prev.docs[id], ...document } },
    }));
  };

  return (
    <div className="App">
      <Drawer
        docState={docState}
        setDocument={setDocument}
        setDocuments={setDocuments}
      />
      <TypeArea doc={currentDoc} setDocument={setDocument} />
    </div>
  );
}

export default App;
