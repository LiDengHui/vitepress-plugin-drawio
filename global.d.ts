declare global {
    interface Window {
        Editor:  {
            initMath(): void;
        }
        onDrawioViewerLoad ():void;
        GraphViewer: {
            processElements ():void;
        }
    }
}