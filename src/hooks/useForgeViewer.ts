import { useEffect, useState } from "react";
import addViewerEventListeners from "../utils/addViewerEventListeners";

declare global {
  interface Window {
    Autodesk: any;
  }
}

const useForgeViewer = (
  urn: string | undefined,
  token: string | null
): Autodesk.Viewing.GuiViewer3D | null => {
  let [forgeViewer, setForgeViewer] =
    useState<Autodesk.Viewing.GuiViewer3D | null>(null);

  useEffect(() => {
    if (forgeViewer) {
      const startCode = forgeViewer.start();
      if (startCode === 0) {
        window.Autodesk.Viewing.Document.load(
          `urn:${urn}`,
          onDocumentLoadSuccess,
          onDocumentLoadFailure
        );
      } else {
        console.error("Failed to start the viewer.");
      }
      const removeViewerEventListners = addViewerEventListeners(forgeViewer);

      // This is a clean up function that clears viewer and events on component unmount
      return () => {
        if (removeViewerEventListners) {
          removeViewerEventListners();
        }

        if (forgeViewer) {
          forgeViewer.finish();
          forgeViewer = null;
          Autodesk.Viewing.shutdown();
        }
      };
    }
  }, [forgeViewer, urn]);

  useEffect(() => {
    if (!urn || !token) {
      console.log("URN or token not available.");
      return;
    }

    console.log("Initializing viewer...");
    const options = {
      env: "AutodeskProduction2",
      api: "streamingV2",
      getAccessToken: (
        onTokenReady: (token: string, expires: number) => void
      ) => {
        onTokenReady(token, 3600);
      },
    };

    window.Autodesk.Viewing.Initializer(options, function () {
      const viewerDiv = document.getElementById("forgeViewer");
      if (viewerDiv) {
        setForgeViewer(new window.Autodesk.Viewing.GuiViewer3D(viewerDiv));
      } else {
        console.error("Viewer element not found.");
      }
    });

    return () => {
      setForgeViewer(null);
    };
  }, [urn, token]);

  const onDocumentLoadSuccess = (viewerDocument: Autodesk.Viewing.Document) => {
    var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
    if (forgeViewer) {
      forgeViewer.loadDocumentNode(viewerDocument, defaultModel);
      forgeViewer?.toolbar?.setVisible(true);
    }
  };

  const onDocumentLoadFailure = () => {
    console.error("Failed fetching Forge manifest");
  };

  return forgeViewer;
};

export default useForgeViewer;
