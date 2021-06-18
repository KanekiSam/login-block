declare module '*.css';
declare module '*.js';
declare module '*.less';
declare module '*.png';
declare module '*.svg' {
  export function ReactComponent(props: React.SVGProps<SVGSVGElement>): React.ReactElement;
  const url: string;
  export default url;
}
declare module 'rc-form' {
  export const createForm: any;
  export const createFormField: any;
  export const formShape: any;
}
declare module 'js-cookie';
