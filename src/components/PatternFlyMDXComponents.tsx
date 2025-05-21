import type { MDXComponents } from "mdx/types";
import { Content, ContentVariants, Divider } from "@patternfly/react-core";

export const components: MDXComponents = {
  p: (properties) => {
    return (
      <Content
        component={ContentVariants.p}
        isEditorial
        {...properties}
      ></Content>
    );
  },
  h1: (properties) => {
    return (
      <Content
        component={ContentVariants.h1}
        isEditorial
        {...properties}
      ></Content>
    );
  },
  h2: (properties) => {
    return (
      <Content
        component={ContentVariants.h2}
        isEditorial
        {...properties}
      ></Content>
    );
  },
  h3: (properties) => {
    return (
      <Content
        component={ContentVariants.h3}
        isEditorial
        {...properties}
      ></Content>
    );
  },
  h4: (properties) => {
    return (
      <Content
        component={ContentVariants.h4}
        isEditorial
        {...properties}
      ></Content>
    );
  },
  h5: (properties) => {
    return (
      <Content
        component={ContentVariants.h5}
        isEditorial
        {...properties}
      ></Content>
    );
  },
  h6: (properties) => {
    return (
      <Content
        component={ContentVariants.h6}
        isEditorial
        {...properties}
      ></Content>
    );
  },
  hr: (properties) => {
    return <Divider {...properties} />;
  },
  ul: (properties) => {
    return <Content component={ContentVariants.ul} {...properties}></Content>;
  },
  ol: (properties) => {
    return <Content component={ContentVariants.ol} {...properties}></Content>;
  },
  li: (properties) => {
    return <Content component={ContentVariants.li} {...properties} />;
  },
  blockquote: (properties) => {
    return <Content component={ContentVariants.blockquote} {...properties} />;
  },
};
