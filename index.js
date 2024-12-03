import { html, GApp, css, $ref } from "gloomjs";
import Editor from "./components/editor";
import Tree from "./components/tree";
import TreeItem from "./components/tree-item";
import WebFS from "./lib/fs-provider-web.js";
//@ts-ignore
import * as DefaultProject from "./lib/default_project.json" assert { type: 'json' };

async function App(){
      const fs = await WebFS.create('project');
      const fsNavbar = $ref();
      //<Editor fs=${fs}/>
      const dir = {
            path: '',
            //@ts-ignore idk why it requires default.
            children: DefaultProject.default
      };

      const style = css`
            .btn {
                  border-radius: 5px;
                  width: 20px;
                  height: 20px;
                  padding: 5px;
            }
            .btn:hover {
                  background-color: var(--secondary-color);
                  cursor: pointer;
            }
            .btn:active {
                  filter: brightness(20%);
            }
      `

      return html`
            <div style="display: flex;" scope=${style}>
                  <div>
                        <span class="btn" @click=${() => fsNavbar.element.style.width = '0px'}>x</span>
                        <div style="height: 100vh;" ref=${fsNavbar}>
                              <Tree dir=${dir}/>
                        </div>
                  </div>
                  <div style="height: 100vh; width: 80%;">
                        <Editor fs=${fs}/>       
                  </div>
            </div>
      `
}

App().then(
      app => {
            GApp
            .registerComponent(TreeItem)
            .registerComponent(Tree)
            .registerComponent(Editor, 'Editor')
            .createRoot( app, document.body );
      }
);