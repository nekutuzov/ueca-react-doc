import * as UECA from "ueca-react";
import {
    ScreenBaseModel, ScreenBaseParams, ScreenBaseStruct, useScreenBase, Col, Row, useMarkdownPreview,
    MarkdownPreviewModel, DocsTocModel, useDocsToc, DocsPagerModel, useDocsPager
} from "@components";
import { Breadcrumb, CRUDScreenModel, useCRUDScreen, runAsync } from "@core";
import "./docsScreen.css";
// The guide moved from docs/ to docs/raw/original/ in ueca-react 3.0. Order and titles below
// follow docs/raw/index.md, "UECA-React Programming Guide".
import introductionDoc from "../../../node_modules/ueca-react/docs/raw/original/Introduction to UECA-React.md?raw";
import technologyDoc from "../../../node_modules/ueca-react/docs/raw/original/Technology of UECA-React.md?raw";
import componentMentalModelDoc from "../../../node_modules/ueca-react/docs/raw/original/Component Mental Model in UECA-React.md?raw";
import componentIntegrationModelDoc from "../../../node_modules/ueca-react/docs/raw/original/Component Integration Model in UECA-React.md?raw";
import introComponentsDoc from "../../../node_modules/ueca-react/docs/raw/original/Introduction to UECA-React Components.md?raw";
import componentIdsDoc from "../../../node_modules/ueca-react/docs/raw/original/Component IDs in UECA-React.md?raw";
import lifecycleHooksDoc from "../../../node_modules/ueca-react/docs/raw/original/Lifecycle Hooks in UECA-React.md?raw";
import stateManagementDoc from "../../../node_modules/ueca-react/docs/raw/original/State Management in UECA-React.md?raw";
import propertyBindingsDoc from "../../../node_modules/ueca-react/docs/raw/original/Property Bindings in UECA-React.md?raw";
import onChangeEventsDoc from "../../../node_modules/ueca-react/docs/raw/original/Automatic onChange Events in UECA-React.md?raw";
import onChangingEventsDoc from "../../../node_modules/ueca-react/docs/raw/original/Automatic onChanging Events in UECA-React.md?raw";
import onPropEventsDoc from "../../../node_modules/ueca-react/docs/raw/original/Automatic onPropChange and onPropChanging Events in UECA-React.md?raw";
import messageBusDoc from "../../../node_modules/ueca-react/docs/raw/original/Message Bus in UECA-React.md?raw";
import arraysReactivityDoc from "../../../node_modules/ueca-react/docs/raw/original/Arrays and Reactivity in UECA-React.md?raw";
import modelCachingDoc from "../../../node_modules/ueca-react/docs/raw/original/Model Caching in UECA-React.md?raw";
import componentExtensionDoc from "../../../node_modules/ueca-react/docs/raw/original/Component Extension in UECA-React.md?raw";
import specializedFactoriesDoc from "../../../node_modules/ueca-react/docs/raw/original/Specialized Component Factories in UECA-React.md?raw";
import tracingDoc from "../../../node_modules/ueca-react/docs/raw/original/Tracing in UECA-React.md?raw";
import errorHandlingDoc from "../../../node_modules/ueca-react/docs/raw/original/Error Handling in UECA-React.md?raw";
import utilityFunctionsDoc from "../../../node_modules/ueca-react/docs/raw/original/Utility Functions in UECA-React.md?raw";
import codeTemplateDoc from "../../../node_modules/ueca-react/docs/raw/original/code-template.md?raw";

type DocArticle =
    | "introduction"
    | "technology"
    | "component-mental-model"
    | "component-integration-model"
    | "introduction-to-components"
    | "component-ids"
    | "lifecycle-hooks"
    | "state-management"
    | "property-bindings"
    | "onchange-events"
    | "onchanging-events"
    | "onprop-events"
    | "message-bus"
    | "arrays-and-reactivity"
    | "model-caching"
    | "component-extension"
    | "specialized-factories"
    | "tracing"
    | "error-handling"
    | "utility-functions"
    | "code-template";

type DocRoutePath =
    | "/docs/introduction"
    | "/docs/technology"
    | "/docs/component-mental-model"
    | "/docs/component-integration-model"
    | "/docs/introduction-to-components"
    | "/docs/component-ids"
    | "/docs/lifecycle-hooks"
    | "/docs/state-management"
    | "/docs/property-bindings"
    | "/docs/onchange-events"
    | "/docs/onchanging-events"
    | "/docs/onprop-events"
    | "/docs/message-bus"
    | "/docs/arrays-and-reactivity"
    | "/docs/model-caching"
    | "/docs/component-extension"
    | "/docs/specialized-factories"
    | "/docs/tracing"
    | "/docs/error-handling"
    | "/docs/utility-functions"
    | "/docs/code-template";

// Reading order of the guide, matching docs/raw/index.md. The pager is the only thing that
// needs the sequence; titles and paths still come from the switches below, so adding an
// article means adding its id here and to those - not a second copy of the whole table.
const DOC_ORDER: DocArticle[] = [
    "introduction",
    "technology",
    "component-mental-model",
    "component-integration-model",
    "introduction-to-components",
    "component-ids",
    "lifecycle-hooks",
    "state-management",
    "property-bindings",
    "onchange-events",
    "onchanging-events",
    "onprop-events",
    "message-bus",
    "arrays-and-reactivity",
    "model-caching",
    "component-extension",
    "specialized-factories",
    "tracing",
    "error-handling",
    "utility-functions",
    "code-template"
];

type DocsScreenStruct = ScreenBaseStruct<{
    props: {
        article: DocArticle;
    };

    children: {
        crudScreen: CRUDScreenModel;
        markdownPreview: MarkdownPreviewModel;
        toc: DocsTocModel;
        pager: DocsPagerModel;
    };
}>;

type DocsScreenParams = ScreenBaseParams<DocsScreenStruct>;
type DocsScreenModel = ScreenBaseModel<DocsScreenStruct>;

function useDocsScreen(params?: DocsScreenParams): DocsScreenModel {
    const struct: DocsScreenStruct = {
        props: {
            id: useDocsScreen.name,
            article: "introduction"
        },

        children: {
            crudScreen: useCRUDScreen({
                intent: "none",
                contentPaddings: "none",
                breadcrumbs: () => _breadCrumbs(),
                contentView: () => (
                    <Row className="docs-layout" spacing={"none"}>
                        <Col className="docs-column" fill spacing={"none"}>
                            <model.markdownPreview.View />
                            <model.pager.View />
                        </Col>
                        <model.toc.View />
                    </Row>
                )
            }),

            markdownPreview: useMarkdownPreview({
                source: () => _articleSource()
            }),

            toc: useDocsToc({
                source: () => _articleSource()
            }),

            pager: useDocsPager({
                prevLabel: () => _sibling(-1)?.title,
                prevPath: () => _sibling(-1)?.path,
                nextLabel: () => _sibling(1)?.title,
                nextPath: () => _sibling(1)?.path
            })
        },

        messages: {
            // The section of the route is view state this screen owns: whenever the address names
            // one, the article is brought to it. A tick late, because the article for a route that
            // also changed the path has not rendered when this arrives.
            "App.Router.AfterRouteChange": async (route) => {
                runAsync(() => _showSection(route.section));
            }
        },

        // A route resolved before this screen existed broadcast to nobody, so the screen asks. This
        // is the cold-open case: a link to a section, pasted or followed from outside.
        init: async () => {
            const route = await model.getRoute();
            runAsync(() => _showSection(route?.section));
        },

        View: () => <model.crudScreen.View />
    };

    const model = useScreenBase(struct, params);
    return model;

    // Brings the article to the section the route names, or to its top when it names none - an
    // address without a section is the article itself, which is also what makes moving between
    // chapters start at the beginning instead of inheriting the last one's scroll.
    function _showSection(section?: string) {
        const article = document.getElementById(model.markdownPreview.htmlId());
        const scroller = article?.closest(".app-content") as HTMLElement;
        if (!scroller) {
            return;
        }
        const target = section ? document.getElementById(section) : undefined;
        if (!target) {
            scroller.scrollTo({ top: 0 });
            return;
        }
        // Scroll the article's own container rather than calling scrollIntoView, which walks up
        // the ancestors and drags the app shell - top bar and all - off screen. Instant, not
        // smooth: a smooth scroll over this distance is still animating when the next render
        // lands, and the browser abandons it part-way, a few hundred pixels short.
        const delta = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
        scroller.scrollTo({ top: scroller.scrollTop + delta - 12 });
    }

    function _breadCrumbs(): Breadcrumb[] {
        return [
            { route: { path: "/home" }, label: "API Documentation" },
            { route: { path: _articleRoutePath() }, label: _articleTitle() }
        ];
    }

    // The neighbouring article in reading order, or undefined at either end of the guide.
    function _sibling(offset: number): { title: string; path: DocRoutePath } {
        const index = DOC_ORDER.indexOf(model.article);
        const neighbour = index < 0 ? undefined : DOC_ORDER[index + offset];
        return neighbour
            ? { title: _articleTitle(neighbour), path: _articleRoutePath(neighbour) }
            : undefined;
    }

    // Both take the article as an argument so the pager can ask about a neighbour; they
    // default to the one on screen, which is every other call site.
    function _articleRoutePath(article: DocArticle = model.article): DocRoutePath {
        switch (article) {
            case "introduction":
                return "/docs/introduction";
            case "technology":
                return "/docs/technology";
            case "component-mental-model":
                return "/docs/component-mental-model";
            case "component-integration-model":
                return "/docs/component-integration-model";
            case "introduction-to-components":
                return "/docs/introduction-to-components";
            case "component-ids":
                return "/docs/component-ids";
            case "lifecycle-hooks":
                return "/docs/lifecycle-hooks";
            case "state-management":
                return "/docs/state-management";
            case "property-bindings":
                return "/docs/property-bindings";
            case "onchange-events":
                return "/docs/onchange-events";
            case "onchanging-events":
                return "/docs/onchanging-events";
            case "onprop-events":
                return "/docs/onprop-events";
            case "message-bus":
                return "/docs/message-bus";
            case "arrays-and-reactivity":
                return "/docs/arrays-and-reactivity";
            case "model-caching":
                return "/docs/model-caching";
            case "component-extension":
                return "/docs/component-extension";
            case "specialized-factories":
                return "/docs/specialized-factories";
            case "tracing":
                return "/docs/tracing";
            case "error-handling":
                return "/docs/error-handling";
            case "utility-functions":
                return "/docs/utility-functions";
            case "code-template":
                return "/docs/code-template";
        }
    }

    function _articleTitle(article: DocArticle = model.article): string {
        switch (article) {
            case "introduction":
                return "Introduction";
            case "technology":
                return "Technology";
            case "component-mental-model":
                return "Component Mental Model";
            case "component-integration-model":
                return "Component Integration Model";
            case "introduction-to-components":
                return "Introduction to Components";
            case "component-ids":
                return "Component IDs";
            case "lifecycle-hooks":
                return "Lifecycle Hooks";
            case "state-management":
                return "State Management";
            case "property-bindings":
                return "Property Bindings";
            case "onchange-events":
                return "Automatic onChange Events";
            case "onchanging-events":
                return "Automatic onChanging Events";
            case "onprop-events":
                return "Automatic onPropChange and onPropChanging Events";
            case "message-bus":
                return "Message Bus";
            case "arrays-and-reactivity":
                return "Arrays and Reactivity";
            case "model-caching":
                return "Model Caching";
            case "component-extension":
                return "Component Extension";
            case "specialized-factories":
                return "Specialized Component Factories";
            case "tracing":
                return "Tracing";
            case "error-handling":
                return "Error Handling";
            case "utility-functions":
                return "Utility Functions";
            case "code-template":
                return "Standard Code Template";
        }
    }

    function _articleSource(): string {
        switch (model.article) {
            case "introduction":
                return introductionDoc;
            case "technology":
                return technologyDoc;
            case "component-mental-model":
                return componentMentalModelDoc;
            case "component-integration-model":
                return componentIntegrationModelDoc;
            case "introduction-to-components":
                return introComponentsDoc;
            case "component-ids":
                return componentIdsDoc;
            case "lifecycle-hooks":
                return lifecycleHooksDoc;
            case "state-management":
                return stateManagementDoc;
            case "property-bindings":
                return propertyBindingsDoc;
            case "onchange-events":
                return onChangeEventsDoc;
            case "onchanging-events":
                return onChangingEventsDoc;
            case "onprop-events":
                return onPropEventsDoc;
            case "message-bus":
                return messageBusDoc;
            case "arrays-and-reactivity":
                return arraysReactivityDoc;
            case "model-caching":
                return modelCachingDoc;
            case "component-extension":
                return componentExtensionDoc;
            case "specialized-factories":
                return specializedFactoriesDoc;
            case "tracing":
                return tracingDoc;
            case "error-handling":
                return errorHandlingDoc;
            case "utility-functions":
                return utilityFunctionsDoc;
            case "code-template":
                return codeTemplateDoc;
        }
    }
}

const DocsScreen = UECA.getFC(useDocsScreen);

export { DocsScreenModel, DocsScreenParams, useDocsScreen, DocsScreen };
