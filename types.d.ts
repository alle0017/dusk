interface FileSystemProvider {
      readFile: ( filePath: string ) => Promise<string>;
      writeFile: ( filePath: string, text: string ) => Promise<void>;
}

type Directory = {
      path: string,
      children?: Directory[],
}