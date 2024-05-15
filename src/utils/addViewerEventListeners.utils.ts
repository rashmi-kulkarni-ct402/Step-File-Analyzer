/* Utitlity Function
 * Adds event listeners to a Forge Viewer instance, handles selection changes within the viewer,
 * logging the database ID (dbId) of the selected object.
 */

const addViewerEventListeners = (
  forgeViewer: Autodesk.Viewing.GuiViewer3D | null
): (() => void) | undefined => {
  const handleSelectionChanged = (event: any) => {
    // Retrieve the list of currently selected object IDs in the viewer
    const dbIds = forgeViewer?.getSelection();
    if (dbIds && dbIds.length > 0) {
      // Focus on the first selected object ID
      const dbId = dbIds[0];
      console.log("Selected dbId:", dbId);
    }
  };

  // Check if the Forge Viewer instance is valid before adding the event listener
  if (forgeViewer) {
    // Add the event listener for the selection changed event
    forgeViewer.addEventListener(
      Autodesk.Viewing.SELECTION_CHANGED_EVENT,
      handleSelectionChanged
    );
    // Return a cleanup function that removes the event listener when called
    return () => {
      forgeViewer.removeEventListener(
        Autodesk.Viewing.SELECTION_CHANGED_EVENT,
        handleSelectionChanged
      );
    };
  }
};

export default addViewerEventListeners;
