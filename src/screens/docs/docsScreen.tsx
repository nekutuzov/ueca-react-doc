import * as UECA from "ueca-react";
import { ScreenBaseModel, ScreenBaseParams, ScreenBaseStruct, useScreenBase, Block, useMarkdownPreview, MarkdownPreviewModel } from "@components";
import { Breadcrumb, CRUDScreenModel, useCRUDScreen } from "@core";
import introductionDoc from "../../../node_modules/ueca-react/docs/Introduction to UECA-React.md?raw";
import technologyDoc from "../../../node_modules/ueca-react/docs/Technology of UECA-React.md?raw";
import componentMentalModelDoc from "../../../node_modules/ueca-react/docs/Component Mental Model in UECA-React.md?raw";
import componentIntegrationModelDoc from "../../../node_modules/ueca-react/docs/Component Integration Model in UECA-React.md?raw";
import introComponentsDoc from "../../../node_modules/ueca-react/docs/Introduction to UECA-React Components.md?raw";
import componentIdsDoc from "../../../node_modules/ueca-react/docs/Component IDs in UECA-React.md?raw";
import lifecycleHooksDoc from "../../../node_modules/ueca-react/docs/Lifecycle Hooks in UECA-React.md?raw";
import stateManagementDoc from "../../../node_modules/ueca-react/docs/State Management in UECA-React.md?raw";
import propertyBindingsDoc from "../../../node_modules/ueca-react/docs/Property Bindings in UECA-React.md?raw";
import onChangeEventsDoc from "../../../node_modules/ueca-react/docs/Automatic onChange Events in UECA-React.md?raw";
import onChangingEventsDoc from "../../../node_modules/ueca-react/docs/Automatic onChanging Events in UECA-React.md?raw";
import onPropEventsDoc from "../../../node_modules/ueca-react/docs/Automatic onPropChange and onPropChanging Events in UECA-React.md?raw";
import messageBusDoc from "../../../node_modules/ueca-react/docs/Message Bus in UECA-React.md?raw";
import arraysReactivityDoc from "../../../node_modules/ueca-react/docs/Arrays and Reactivity in UECA-React.md?raw";
import modelCachingDoc from "../../../node_modules/ueca-react/docs/Model Caching in UECA-React.md?raw";
import componentExtensionDoc from "../../../node_modules/ueca-react/docs/Component Extension in UECA-React.md?raw";
import specializedFactoriesDoc from "../../../node_modules/ueca-react/docs/Specialized Component Factories in UECA-React.md?raw";
import tracingDoc from "../../../node_modules/ueca-react/docs/Tracing in UECA-React.md?raw";
import codeTemplateDoc from "../../../node_modules/ueca-react/docs/code-template.md?raw";

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
    | "/docs/code-template";

type DocsScreenStruct = ScreenBaseStruct<{
    props: {
        article: DocArticle;
    };

    children: {
        crudScreen: CRUDScreenModel;
        markdownPreview: MarkdownPreviewModel;
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
                breadcrumbs: () => _breadCrumbs(),
                contentView: () => (
                    <Block fill padding="large" sx={{ maxWidth: "1200px", margin: "0 auto" }}>
                        <model.markdownPreview.View />
                    </Block>
                )
            }),

            markdownPreview: useMarkdownPreview({
                source: () => _articleSource()
            })
        },

        View: () => <model.crudScreen.View />
    };

    const model = useScreenBase(struct, params);
    return model;

    function _breadCrumbs(): Breadcrumb[] {
        return [
            { route: { path: "/home" }, label: "API Documentation" },
            { route: { path: _articleRoutePath() }, label: _articleTitle() }
        ];
    }

    function _articleRoutePath(): DocRoutePath {
        switch (model.article) {
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
            case "code-template":
                return "/docs/code-template";
        }
    }

    function _articleTitle(): string {
        switch (model.article) {
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
            case "code-template":
                return codeTemplateDoc;
        }
    }
}

const DocsScreen = UECA.getFC(useDocsScreen);

export { DocsScreenModel, DocsScreenParams, useDocsScreen, DocsScreen };
