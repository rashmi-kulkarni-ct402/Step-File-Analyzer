// Custom hook to initialize and manage Autodesk's Forge Viewer.

import { useEffect, useState } from "react";
import addViewerEventListeners from "../utils/addViewerEventListeners.utils";

declare global {
  interface Window {
    // Declare Autodesk on the window object for global access
    Autodesk: any;
  }
}

const useForgeViewer = (
  urn: string | undefined,
  token: string | null
): Autodesk.Viewing.GuiViewer3D | null => {
  let [forgeViewer, setForgeViewer] =
    useState<Autodesk.Viewing.GuiViewer3D | null>(null);
  let [removeViewerEventListners, setRemoveViewerEventListners] = useState<
    (() => void) | undefined
  >();

  useEffect(
    () => () => {
      if (removeViewerEventListners) {
        removeViewerEventListners();
      }

      if (forgeViewer) {
        // Properly shut down the viewer to clean up resources.
        forgeViewer.finish();
        Autodesk.Viewing.shutdown();
        setForgeViewer(null);
      }
    },
    [] // run useEffect on mount & cleanup on unmount
  );

  useEffect(() => {
    // Only proceed if the viewer is already initialized
    if (forgeViewer) {
      // Start the viewer instance
      const startCode = forgeViewer.start();
      if (startCode === 0) {
        // Check if the viewer started successfully
        window.Autodesk.Viewing.Document.load(
          `urn:${urn}`,
          onDocumentLoadSuccess, // Callback for successful document loading
          onDocumentLoadFailure // Callback for failed document loading
        );
      } else {
        console.error("Failed to start the viewer.");
      }

      // Setup and return a cleanup function
      setRemoveViewerEventListners(addViewerEventListeners(forgeViewer));
    }
  }, [forgeViewer, urn]);

  // Exit if the necessary credentials are not available
  useEffect(() => {
    if (!urn || !token) {
      console.log("URN or token not available.");
      return;
    }
    console.log("Initializing viewer...");

    // Viewer initialization settings
    const options = {
      env: "AutodeskProduction2",
      api: "streamingV2",
      getAccessToken: (
        onTokenReady: (token: string, expires: number) => void
      ) => {
        // Provide the token and expiry time to the viewer
        onTokenReady(token, 3600);
      },
    };

    // Initialize the viewer
    window.Autodesk.Viewing.Initializer(options, function () {
      const viewerDiv = document.getElementById("forgeViewer");
      if (viewerDiv) {
        // Set the viewer instance if the div is found
        setForgeViewer(new window.Autodesk.Viewing.GuiViewer3D(viewerDiv));
      } else {
        console.error("Viewer element not found.");
      }
    });
  }, [urn, token]); // Dependencies

  // Callback for successful document load
  const onDocumentLoadSuccess = (viewerDocument: Autodesk.Viewing.Document) => {
    // Get the default model from the loaded document
    var defaultModel = viewerDocument.getRoot().getDefaultGeometry();
    if (forgeViewer) {
      // Load the model into the viewer
      forgeViewer.loadDocumentNode(viewerDocument, defaultModel);
      // Make the toolbar visible
      forgeViewer?.toolbar?.setVisible(true);
    }
  };

  // Callback for failed document load
  const onDocumentLoadFailure = () => {
    console.error("Failed fetching Forge manifest");
  };

  return forgeViewer;
};

export default useForgeViewer;
