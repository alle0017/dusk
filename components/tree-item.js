import { html, css, $signal, $ref } from "gloomjs";
import { getPath, getExtension } from "../lib/fs-provider-web";
//@ts-ignore
import * as Icons from "../assets/icons.json" assert { type: 'json' };
/**@import {Signal} from "gloomjs"*/

/**
 * 
 * @param {string} dirname 
 */
function getDirIcon( dirname ){
      return Icons.directories[dirname]? 
            Icons.basePathDir + Icons.directories[dirname]: 
            Icons.basePathDir + Icons.dir;
}
/**
 * @param {string} path
 */
function getIcon( path ){
      const ext = getExtension(path);
      return ext? Icons.basePathFile + Icons.ext[ ext ] || Icons.ext[".txt"]: getDirIcon( path );
}
/**
 * 
 * @param {{ path: string, width: number, onClick: (path: string) => void }} param0 
 */
export default function TreeItem({ path, width, onClick }){
      //const name = getPath( path ).at( -1 );
      const icon = getIcon(path);

      const style = css`
            li {
                  border-radius: 10px;
                  padding: 5px;
                  display: flex;
                  align-items: center;
            }
            li > * {
                  background-color: transparent;
            }
            li:hover {
                  background-color: var(--secondary-color);
                  cursor: pointer;
            }
            span {
                  margin-left: 10px;
                  font-weight: bolder;
            }

            img { 
                  filter: grayscale(100%); 
                  background-color: transparent;
            } 
            @media(prefers-color-scheme: dark){ 
                  img { 
                        filter: grayscale(100%) invert(90%); 
                  } 
            }
      `

      return html`
            <i scope=${style}></i>
            <li title=${path} style=${ 'width:' + width + 'px' } @click=${() => onClick && onClick(path)}>
                  <img src=${icon} width="30"/>
                  <span>
                        ${ path.length <= 10? path: path.slice(0,7) + '...' }
                  </span>
            </li>
      `
}