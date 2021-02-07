declare module "mini-css-extract-plugin";

declare module "*.scss" {
    const content: {[className: string]: string};
    export default content;
}