import { html, useLifecycle, $ref, $signal, $watcher  } from "gloomjs";
import * as monaco from "monaco-editor"
import { useEditor, useEditorContext } from "./lib";
import Tabs from "../tabs";
import { getPath } from "../../lib/fs-provider-web";
/**@import {Signal} from "gloomjs" */


/**
 * @typedef StoredFile
 * @property {monaco.editor.ITextModel} model
 * @property {boolean} isOpen
 */

/**
 * @typedef EditorProperties
 * @property {FileSystemProvider} fs
 */

const Editor = useLifecycle( ({ onMount, onDispose }) => /**@param {EditorProperties} p*/({ fs }) => {
      const context = useEditorContext();
      // container of the Editor
      const container = $ref();
      /**
       * @type {Map<string,StoredFile>}
       */
      const fileStore = new Map();
      /**
       * navbar items
       */
      const items = $signal(['page1']);
      /**
       * @type {monaco.editor.IStandaloneCodeEditor}
       */
      let editor; 
      /**
       * current active path
       */
      let currentPath = '';

      onMount( () => {
            editor = useEditor( container.element );
      });

      const unsubscribe = $watcher( async () => {

            // check for spurious changes
            // before the ide is initialized
            if( !editor ){
                  return;
            }

            /**
             * @type {monaco.editor.ITextModel}
             */
            let model;

            // use a private map to store models based on the filename
            // then watch the filename only
            if( fileStore.has( context.file.value ) ){
                  const meta = fileStore.get( context.file.value );
                  model = meta.model
            }else{
                  try {
                        const text = await fs.readFile( context.file.value );
                        console.log(text)

                        // TODO handle language dynamically
                        model = monaco.editor.createModel( 
                              text, 
                              'typescript' 
                        );
                  }catch{
                        console.log('errore')
                  }
            }

            // store the old model so that can be reused
            const oldModel = editor.getModel();

            fileStore.set( currentPath, {
                  model: oldModel,
                  isOpen: true,
            });

            try {
                  await fs.writeFile( currentPath, oldModel.getValue() );
            }catch{
                  // handle write error
            }

            // set the current file path and the model
            currentPath = context.file.value;
            editor.setModel( model );
            
      }, context.file );
      
      onDispose( () => {
            editor.dispose();
            unsubscribe();
      });
      
      return html`
            ${Tabs({ 
                  onChange: str => {
                        context.file.value = str;
                  }, 
                  onClose: idx => {
                        items.value.splice( idx, 1 );
                        items.value = items.value;
                  }, 
                  items 
            })}
            <div style="height: calc(100% - 39px); margin-top: 40px;" ref=${container}></div>
      `
});

export default Editor;