/* eslint-disable @typescript-eslint/no-explicit-any */

import '@babel/traverse';

declare module '@babel/traverse' {
  export interface NodePath {
    getData(key: string | symbol, def?: any): any;
    setData(key: string | symbol, val: any): any;
  }
}

export {};
