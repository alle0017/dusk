import { html, useLifecycle, $ref, createContext, $signal, $watcher  } from "gloomjs";
import * as monaco from "monaco-editor"
//@ts-ignore
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
//@ts-ignore
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
//@ts-ignore
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
//@ts-ignore
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
//@ts-ignore
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'
/**@import {Signal} from "gloomjs" */

/**
 * get the public context of the editor, like the current active file
 */
export const useEditorContext = createContext({
      file: $signal('')
});

/**
 * create new editor instance
 * @param {HTMLElement} container 
 */
export const useEditor = ( container ) => {

      self.MonacoEnvironment = {
            getWorker(_, label) {
                  if (label === 'json') {
                        return new jsonWorker()
                  }
                  if (label === 'css' || label === 'scss' || label === 'less') {
                        return new cssWorker()
                  }
                  if (label === 'html' || label === 'handlebars' || label === 'razor') {
                        return new htmlWorker()
                  }
                  if (label === 'typescript' || label === 'javascript') {
                        return new tsWorker()
                  }
                  return new editorWorker()
            }
      }
      const editor = monaco.editor.create( container, {
            automaticLayout: true,
            theme: "vs-dark",
      });

      return editor;
}