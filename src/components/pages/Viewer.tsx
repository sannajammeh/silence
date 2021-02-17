import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IDocument } from "../../models/Document";
import { db } from "../../utils/firebase";
import Spinner from "../Spinner";
import TypeArea from "../TypeArea";
import { Helmet } from "react-helmet";

const Viewer = () => {
  const [loading, setLoading] = useState(true);
  const [doc, setDoc] = useState<IDocument | null>(null);
  const { userId, documentId } = useParams<{
    userId: string;
    documentId: string;
  }>();

  useEffect(() => {
    const ref = db.ref(`documents/${userId}/docs/${documentId}`);
    ref.on("value", (snapshot) => {
      setLoading(false);
      if (!snapshot.exists) return;
      setDoc(snapshot.val());
    });

    return () => {
      ref.off("value");
    };
  }, [documentId, userId]);

  const setDocument = () => {};

  if (loading) return <Spinner />;
  if (!doc)
    return (
      <div
        className="container"
        style={{ textAlign: "center", marginTop: "4rem", fontSize: "2rem" }}
      >
        This document does not exist
      </div>
    );

  return (
    <div>
      <Helmet>
        <title>{doc.title}</title>
      </Helmet>
      <TypeArea doc={doc} setDocument={setDocument} readonly />
    </div>
  );
};

export default Viewer;
