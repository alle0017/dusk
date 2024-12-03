/**
 * 
 * @param  {...string} keys 
 */
export const useShortcut = (...keys) => {
      document.addEventListener( 'keydown', e => {
            e.metaKey
      })
}