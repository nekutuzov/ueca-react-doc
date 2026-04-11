import { Route } from "@components";
import {
    HomeScreen,
    DocsScreen
} from "@screens";


const screenRoutes = {
    "/": () => <HomeScreen id={"homeScreen"} />,
    "/home": () => <HomeScreen id={"homeScreen"} page={"welcome"} />,
    "/docs/introduction": () => <DocsScreen id={"docsScreen"} article={"introduction"} />,
    "/docs/technology": () => <DocsScreen id={"docsScreen"} article={"technology"} />,
    "/docs/component-mental-model": () => <DocsScreen id={"docsScreen"} article={"component-mental-model"} />,
    "/docs/component-integration-model": () => <DocsScreen id={"docsScreen"} article={"component-integration-model"} />,
    "/docs/introduction-to-components": () => <DocsScreen id={"docsScreen"} article={"introduction-to-components"} />,
    "/docs/component-ids": () => <DocsScreen id={"docsScreen"} article={"component-ids"} />,
    "/docs/lifecycle-hooks": () => <DocsScreen id={"docsScreen"} article={"lifecycle-hooks"} />,
    "/docs/state-management": () => <DocsScreen id={"docsScreen"} article={"state-management"} />,
    "/docs/property-bindings": () => <DocsScreen id={"docsScreen"} article={"property-bindings"} />,
    "/docs/onchange-events": () => <DocsScreen id={"docsScreen"} article={"onchange-events"} />,
    "/docs/onchanging-events": () => <DocsScreen id={"docsScreen"} article={"onchanging-events"} />,
    "/docs/onprop-events": () => <DocsScreen id={"docsScreen"} article={"onprop-events"} />,
    "/docs/message-bus": () => <DocsScreen id={"docsScreen"} article={"message-bus"} />,
    "/docs/arrays-and-reactivity": () => <DocsScreen id={"docsScreen"} article={"arrays-and-reactivity"} />,
    "/docs/model-caching": () => <DocsScreen id={"docsScreen"} article={"model-caching"} />,
    "/docs/component-extension": () => <DocsScreen id={"docsScreen"} article={"component-extension"} />,
    "/docs/specialized-factories": () => <DocsScreen id={"docsScreen"} article={"specialized-factories"} />,
    "/docs/tracing": () => <DocsScreen id={"docsScreen"} article={"tracing"} />,
    "/docs/code-template": () => <DocsScreen id={"docsScreen"} article={"code-template"} />,
};


const otherRoutes = {
    // Add routes without the app layout like document viewers and external links
    "https://cranesoft.net": () => null,    
    "https://github.com/nekutuzov/ueca-react-doc": () => null,    
    "https://youtu.be/SQl8f-qGxwU?si=-YTWPpPB7ExBZ6L0": () => null,
    "https://www.npmjs.com/package/ueca-react": () => null,
    "mailto:cranesoft@protonmail.com": () => null
};

type OtherRoutes = typeof otherRoutes;
type OtherRoute = Route<OtherRoutes>;

type ScreenRoutes = typeof screenRoutes;
type ScreenRoute = Route<ScreenRoutes>;

type AppRoute = ScreenRoute | OtherRoute;

type AppRouteParams<T extends AppRoute["path"]> = Extract<AppRoute, { path: T }>["params"];

export { otherRoutes, screenRoutes, OtherRoute, ScreenRoute, AppRoute, AppRouteParams };
