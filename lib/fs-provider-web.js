/**
 * returns an array containing the path from the root dir to the file
 * @param {string} path 
 */
export const getPath = path => path.split('/');
/**
 * returns the extension of the specified filename
 * @param {string} fName 
 */
export const getExtension = fName => fName.indexOf('.') >= 0? fName.slice( fName.indexOf('.') ): '';

/**
 * use IndexedDB to create a virtualization of the filesystem
 * @implements {FileSystemProvider}
 */
export default class WebFS {
      /**
       * filePath is the unique key for each object
       */

      /**
       * @type {IDBDatabase}
       */
      #db;
      /**
       * @type {string}
       */
      #dbName;

      /**
       * 
       * @param {string} projectName 
       * @throws {Error} if the opening of the db fails
       * @returns {Promise<WebFS>}
       */
      static async create( projectName ){
            const request = indexedDB.open( '_fs', 1 )

            return new Promise((resolve, reject) => {
                  request.onerror = () => {
                        throw new Error("database opening failed")
                  }
                  request.onsuccess = () => {
                        const db = request.result;
      
                        resolve(new WebFS( db, projectName ));
                  }
                  request.onupgradeneeded = () => {
                        var db = request.result;
                        if( db.objectStoreNames.contains( projectName ) ) {
                              db.deleteObjectStore( projectName );
                        }
                        db.createObjectStore( projectName, {
                              // path to the file
                              keyPath: "filePath"
                        });
      
                        resolve(new WebFS( db, projectName ));
                  }
            })
      }
      /**
       * 
       * @param {IDBDatabase} db 
       * @param {string} dbName 
       */
      constructor( db, dbName ){
            this.#db = db;
            this.#dbName = dbName;
      }
      /**
       * 
       * @param {string} filePath 
       * @returns {Promise<string>}
       */
      async readFile( filePath ){
            const trans = this.#db.transaction([this.#dbName], "readonly");
            const store = trans.objectStore(this.#dbName);
            const request = store.get( filePath );

            return new Promise( (resolve,reject) => {
                  request.onsuccess = () => {
                        resolve( request.result? request.result.content: '' )
                  }
                  request.onerror = (e) => {
                        resolve('');
                  }
            })
      }     
      /**
       * 
       * @param {string} filePath 
       * @param {string} content 
       */
      async writeFile( filePath, content ){
            const trans = this.#db.transaction( [ this.#dbName ], "readwrite");
            const store = trans.objectStore( this.#dbName );
            const request = store.put({
                  filePath,
                  content,
            });
            return new Promise( (resolve, reject) => {
                  request.onsuccess = resolve;
                  request.onerror = reject;
            })
      }
}