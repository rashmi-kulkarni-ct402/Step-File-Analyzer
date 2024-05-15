/*
 * Viewer Component
 * This component is responsible for initializing and displaying the Autodesk Forge Viewer.
 */

import { useState, useEffect } from "react";
import addViewerEventListeners from "../utils/addViewerEventListeners.utils";

// Define the props type for the Viewer component
type ViewerProps = {
  urn: string | undefined;
  token: string | null;
};

export default function Viewer({ urn, token }: ViewerProps) {
  // State to hold the Forge Viewer instance
  const [forgeViewer, setForgeViewer] =
    useState<Autodesk.Viewing.GuiViewer3D | null>(null);
  // State to hold the cleanup function for viewer event listeners
  const [removeViewerEventListners, setRemoveViewerEventListners] = useState<
    (() => void) | undefined
  >();

  // Effect hook to clean up the viewer and event listeners on unmount
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

  return (
    <div
      id="forgeViewer"
      style={{
        background: "lightgrey",
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    />
  );
}
