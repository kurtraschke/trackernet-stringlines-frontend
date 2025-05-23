import {
  createRootRoute,
  Link,
  linkOptions,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {
  Brand,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  Nav,
  NavItem,
  NavList,
  Page,
  PageSection,
} from "@patternfly/react-core";

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/patternfly-addons.scss";
import { css } from "@patternfly/react-styles";
import navStyles from "@patternfly/react-styles/css/components/Nav/nav";
import "../app.css";
import logo from "../assets/logo.svg";

export const Route = createRootRoute({
  component: RouteComponent,
});

function RouteComponent() {
  const options = linkOptions([
    {
      to: "/",
      label: "Home",
      activeOptions: { exact: true },
    },
    {
      to: "/about",
      label: "About",
    },
    {
      to: "/stringline",
      label: "Stringlines",
    },
  ]);

  const masthead = (
    <Masthead inset={{ default: "insetLg" }}>
      <MastheadMain>
        <MastheadBrand>
          <MastheadLogo component={(props) => <Link {...props} to="/" />}>
            <Brand
              src={logo}
              alt="Trackernet Stringlines"
              heights={{ default: "36px" }}
            />
          </MastheadLogo>
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Nav variant="horizontal">
          <NavList>
            {options.map((option) => (
              <NavItem
                key={option.to}
                to={option.to}
                component={(props) => {
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  const { href: to, ...linkProps } = props;
                  return (
                    <Link
                      to={to as string}
                      {...linkProps}
                      activeProps={{
                        className: css(navStyles.modifiers.current),
                      }}
                    />
                  );
                }}
              >
                {option.label}
              </NavItem>
            ))}
          </NavList>
        </Nav>
      </MastheadContent>
    </Masthead>
  );

  return (
    <>
      <Page isContentFilled masthead={masthead}>
        <PageSection isFilled={true}>
          <Outlet />
        </PageSection>
      </Page>
      <TanStackRouterDevtools />
    </>
  );
}
