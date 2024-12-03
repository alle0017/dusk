import { html, css, $signal, $ref, createContext } from "gloomjs";
import TreeItem from "./tree-item";
//@ts-ignore
import * as Icons from "../assets/icons.json" assert { type: 'json' };

/**
 * 
 * @param {Object} param0 
 * @param {Directory} param0.dir
 * @param {number?} param0.pWidth parent width
 * 
 */
export default function Tree({ dir, pWidth, }){
      const children = $signal(dir.children);
      const ul = $ref();
      const width = pWidth? pWidth - 20: 200;
      const style = css`

            img { 
                  filter: grayscale(100%); 
                  background-color: transparent;
            } 
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
            @media(prefers-color-scheme: dark){ 
                  img { 
                        filter: grayscale(100%) invert(90%); 
                  } 
            }
      `;
      
      return html`
            ${dir.path? html`
                  <span scope=${style}></span>
                  <div style="display: flex;">
                        <TreeItem
                                    width=${width}
                                    path=${dir.path}
                                    onClick=${() => 
                                          ul.element.style.display = 
                                          ul.element.style.display == 'none'? 
                                                'block' : 
                                                'none'
                        }/>
                        <span class="btn" @click=${() => { 
                              children.value.push({ path: 'file.js' }); 
                              children.value = children.value; 
                        }}>
                              <img src=${Icons.basePathFile + Icons.newfile} style="margin-right: 20px" width="20"/>
                        </span>
                        <span class="btn" @click=${() => { 
                              children.value.push({ 
                                    path: 'dir',
                                    children: [],
                              }); 
                              children.value = children.value; 
                        }}>
                              <img src=${Icons.basePathDir + Icons.newdir} width="20"/>
                        </span>      
                  </div>
                  `: ''
            }
            <ul style="padding-left: 20px;" ref=${ul}>
            ${children
                  .map( v => v.children?
                              Tree({ dir: v, pWidth: width }):
                              TreeItem({
                                    width: width, 
                                    path: v.path,
                                    onClick: () => 
                                          ul.element.style.display = 
                                          ul.element.style.display == 'none'? 
                                                'block' : 
                                                'none'
                              })
                  )
            }
            </ul>
      `
}