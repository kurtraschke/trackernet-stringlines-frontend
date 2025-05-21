import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import {
  Brand,
  Button,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadLogo,
  MastheadMain,
  Page,
  PageSection,
  Spinner,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";

import "@patternfly/react-core/dist/styles/base.css";
import "@patternfly/patternfly/patternfly-addons.scss";
import "../app.css";
import logo from "../assets/logo.svg";
import { useIsFetching } from "@tanstack/react-query";

export const Route = createRootRoute({
  component: RouteComponent,
});

function RouteComponent() {
  const isFetching = useIsFetching();

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
        <Toolbar>
          <ToolbarContent>
            <ToolbarItem>
              <Button
                variant="link"
                component={(props) => <Link {...props} to="/" />}
              >
                Home
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button
                variant="link"
                component={(props) => <Link {...props} to="/about" />}
              >
                About
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button
                variant="link"
                component={(props) => <Link {...props} to="/stringline" />}
              >
                Stringlines
              </Button>
            </ToolbarItem>
            <ToolbarItem align={{ default: "alignEnd" }}>
              {isFetching ? <Spinner size="sm" /> : null}
            </ToolbarItem>
          </ToolbarContent>
        </Toolbar>
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
