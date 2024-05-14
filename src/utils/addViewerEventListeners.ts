import { useEffect } from "react";

const addViewerEventListeners = (
  forgeViewer: Autodesk.Viewing.GuiViewer3D | null
): (() => void) | undefined => {
  const handleSelectionChanged = (event: any) => {
    const dbIds = forgeViewer?.getSelection();
    if (dbIds && dbIds.length > 0) {
      const dbId = dbIds[0];
      console.log("Selected dbId:", dbId);
    }
  };

  if (forgeViewer) {
    forgeViewer.addEventListener(
      Autodesk.Viewing.SELECTION_CHANGED_EVENT,
      handleSelectionChanged
    );
    return () => {
      forgeViewer.removeEventListener(
        Autodesk.Viewing.SELECTION_CHANGED_EVENT,
        handleSelectionChanged
      );
    };
  }
};

export default addViewerEventListeners;
