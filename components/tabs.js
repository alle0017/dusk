import { html, css, $signal, $ref } from "gloomjs";
/**@import {Ref,Signal} from  "gloomjs"*/

/**
 * 
 * @param {Object} param0 
 * @param {Ref<HTMLElement>} param0.active
 * @param {() => void} param0.onClick
 * @param {() => void} param0.onClose
 * @param {string} param0.content
 * @returns 
 */
function TabItem({ content, onClick, onClose, active }){
      const style = css`
            li {
                  float: left;
                  width: 150px;
                  height: 40px;
                  font-weight: bolder;
                  background-color: var(--primary-color);
                  display: flex;
                  justify-content: space-evenly;
                  align-content: center;
                  padding-top: 4px;
                  box-sizing: border-box;
            }
            .close-btn {
                  width: 20px;
                  height: 20px;
                  display: inline-block;
                  font-size: 16px;
                  font-weight: bolder;
                  text-align: center;
                  padding: 5px;
                  border-radius: 5px;
            }
            .content {
                  padding: 5px;
                  text-align: center;
                  display: inline-block;
                  height: 20px;
            }
            .tab_li_active {
                  border-bottom: 3px solid black;
            }
            .content:hover, .close-btn:hover {
                  filter: brightness(50%);
            }
            li:has(.content:hover), .close-btn:hover {
                  background-color: var(--secondary-color);
            }
            .content:active, .close-btn:active {
                  filter: brightness(10%);
            }
      `;

      return html`
            <span scope=${style}></span>
            <li @click=${ /**@param {Event} e */ e => {
                  onClick();
                  const li = e.target instanceof HTMLLIElement? e.target: /**@type {HTMLElement}*/(e.target).parentElement;
                  if( active.element !== li ){
                        active.element && active.element.classList.remove('tab_li_active');
                        active.element = /**@type {HTMLElement}*/(li);
                        active.element.classList.add('tab_li_active');
                  }
            }} title=${content} >
                  <span class="content">
                        ${ content.length <= 10? content: content.slice(0,7) + '...' }
                  </span>
                  <span class="close-btn" @click=${
                        /**@param {Event} e */e =>{
                              e.stopPropagation();
                              onClose();
                              if( active.element === e.target ){
                                    active.element = null;
                              }
                        }
                  }>x</span>
            </li>
      `
}

/**
 * 
 * @param {Object} param0 
 * @param {( element: string ) => void} param0.onChange
 * @param {( index: number ) => void} param0.onClose
 * @param {Signal<string[]>} param0.items
 */
export default function Tabs({ onChange, onClose, items }){
      const active = $ref();

      const style = css`
            ul {
                  list-style: none; 
                  width: 90vw; 
                  min-width: 90%; 
                  position: absolute; 
                  z-index: 1000;
                  margin: 0px;
                  padding: 0px;
            }
      `

      return html`
            <span scope=${style}></span>
            <ul>
                  ${items
                        .map( (content, idx ) => 
                              TabItem({ 
                                    content, 
                                    active,
                                    onClick: () => onChange(content), 
                                    onClose: () => onClose(idx), 
                              }) 
                        )
                  }
            </ul>
      `
}