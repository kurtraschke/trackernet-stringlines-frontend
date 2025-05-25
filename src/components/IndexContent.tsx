import { Button, Content, Split, SplitItem, Stack, StackItem, Title, TitleSizes } from "@patternfly/react-core";
import { css } from "@patternfly/react-styles";
import flex from "@patternfly/react-styles/css/utilities/Flex/flex";
import align from "@patternfly/react-styles/css/utilities/Alignment/alignment";
import spacing from "@patternfly/react-styles/css/utilities/Spacing/spacing";
import one from "../assets/index/one.webp";
import two from "../assets/index/two.webp";
import three from "../assets/index/three.webp";
import boxShadow from "@patternfly/react-styles/css/utilities/BoxShadow/box-shadow";
import text from "@patternfly/react-styles/css/utilities/Text/text";
import { Link, linkOptions } from "@tanstack/react-router";
import React, { type PropsWithChildren } from "react";
import styles from "./index.module.css";

interface GalleryImage {
  path: string,
  alt: string,
}

const galleryImages: GalleryImage[] = [
  {
    path: one,
    alt: "A screenshot of the Trackernet Stringlines tool showing a tooltip with details of a Jubilee Line train"
  },
  {
    path: two,
    alt: "A screenshot of the Trackernet Stringlines tool showing part of a Victoria Line graph and the legend listing the London Underground lines"
  },
  {
    path: three,
    alt: "A screenshot of the Trackernet Stringlines tool showing a portion of a Metropolitan Line chart"
  }
]

const IndexContent : React.FunctionComponent = () => {
  return (
    <Stack
      className={css(
        flex.alignContentCenter,
        flex.justifyContentCenter,
        flex.flexWrap,
      )}
    >
      <StackItem className={css(align.textAlignCenter)}>
        <Title headingLevel="h1" size={TitleSizes["4xl"]}>
          Trackernet Stringlines
        </Title>
      </StackItem>
      <StackItem className={css(align.textAlignCenter)}>
        <Title headingLevel="h2" size={TitleSizes["3xl"]}>
          Graphical Service Analysis for the London Underground
        </Title>
      </StackItem>
      <StackItem className={css(spacing.pyLg, spacing.mxAuto)}>
        <Split hasGutter>
          {galleryImages.map(({path, alt}) => {
            return (
              <SplitItem key={path}>
                <img className={css(boxShadow.boxShadowMd, styles.screenshot)} src={path} alt={alt}></img>
              </SplitItem>
            );
          })}
        </Split>
      </StackItem>
      <StackItem>
        <Content isEditorial className={css(text.fontSizeXl)}>
          What's happening{" "}
          <LinkButton
            linkOptions={linkOptions({
              to: "/stringline/$config/today",
              params: { config: "500" },
            })}
          >
            on the Jubilee Line today
          </LinkButton>
          ? What happened{" "}
          <LinkButton
            linkOptions={linkOptions({
              to: "/stringline/$config/yesterday",
              params: { config: "900" },
            })}
          >
            on the Victoria Line yesterday
          </LinkButton>
          ?
        </Content>
        <Content isEditorial className={css(text.fontSize_2xl)}>
          <LinkButton linkOptions={linkOptions({ to: "/about" })}>
            Learn more
          </LinkButton>{" "}
          or <LinkButton linkOptions={linkOptions({ to: "/stringline" })}>explore the graphs</LinkButton>.
        </Content>
      </StackItem>
    </Stack>
  );

}

interface LinkButtonProps {
  linkOptions: object;
}

const LinkButton: React.FunctionComponent<
  PropsWithChildren<LinkButtonProps>
> = (props) => {
  const { linkOptions, children, ...buttonProps } = props;
  return (
    <Button
      {...buttonProps}
      variant="link"
      isInline
      component={(props) => <Link {...props} {...linkOptions} />}
    >
      {children}
    </Button>
  );
};

export default IndexContent;