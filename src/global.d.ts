declare interface window {
    Editor:  {
        initMath(): void;
    }
    onDrawioViewerLoad ():void;
    GraphViewer: {
        processElements ():void;
    }
}
