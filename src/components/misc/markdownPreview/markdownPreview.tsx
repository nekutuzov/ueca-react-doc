
import * as UECA from "ueca-react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Col, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";

type MarkdownPreviewStruct = UIBaseStruct<{
    props: {
        source: string;
        skipHtml: boolean;
    };
}>;

type MarkdownPreviewParams = UIBaseParams<MarkdownPreviewStruct>;
type MarkdownPreviewModel = UIBaseModel<MarkdownPreviewStruct>;

function useMarkdownPreview(params?: MarkdownPreviewParams): MarkdownPreviewModel {
    const struct: MarkdownPreviewStruct = {
        props: {
            id: useMarkdownPreview.name,
            source: "",
            skipHtml: false,
        },

        View: () => (
            <Col 
                id={model.htmlId()} 
                fill
                onClick={async (e: React.MouseEvent) => {
                    const target = e.target as HTMLElement;
                    const anchor = target.closest('a');
                    
                    if (anchor) {
                        const href = anchor.getAttribute('href');
                        if (href && href.startsWith('/')) {
                                // Internal route - use UECA router
                            e.preventDefault();
                                const appRoutePath = resolveDocPath(href);
                                await model.bus.unicast("App.Router.GoToRoute", { path: appRoutePath as any });
                        }
                        // External links will use default behavior
                    }
                }}
            >
                <MarkdownPreview
                    source={model.source}
                    skipHtml={model.skipHtml}
                />
            </Col>
        )
    };

    const model = useUIBase(struct, params);
    return model;

    function resolveDocPath(rawHref: string): string {
        const href = decodeURIComponent(rawHref).trim();
        const docRouteMap: Record<string, string> = {
            "/docs/Introduction to UECA-React.md": "/docs/introduction",
            "/docs/Technology of UECA-React.md": "/docs/technology",
            "/docs/Component Mental Model in UECA-React.md": "/docs/component-mental-model",
            "/docs/Component Integration Model in UECA-React.md": "/docs/component-integration-model",
            "/docs/Introduction to UECA-React Components.md": "/docs/introduction-to-components",
            "/docs/Component IDs in UECA-React.md": "/docs/component-ids",
            "/docs/Lifecycle Hooks in UECA-React.md": "/docs/lifecycle-hooks",
            "/docs/State Management in UECA-React.md": "/docs/state-management",
            "/docs/Property Bindings in UECA-React.md": "/docs/property-bindings",
            "/docs/Automatic onChange Events in UECA-React.md": "/docs/onchange-events",
            "/docs/Automatic onChanging Events in UECA-React.md": "/docs/onchanging-events",
            "/docs/Automatic onPropChange and onPropChanging Events in UECA-React.md": "/docs/onprop-events",
            "/docs/Message Bus in UECA-React.md": "/docs/message-bus",
            "/docs/Arrays and Reactivity in UECA-React.md": "/docs/arrays-and-reactivity",
            "/docs/Model Caching in UECA-React.md": "/docs/model-caching",
            "/docs/Component Extension in UECA-React.md": "/docs/component-extension",
            "/docs/Specialized Component Factories in UECA-React.md": "/docs/specialized-factories",
            "/docs/Tracing in UECA-React.md": "/docs/tracing",
            "/docs/code-template.md": "/docs/code-template"
        };

        return docRouteMap[href] ?? rawHref;
    }
}

const MarkdownPreviewComponent = UECA.getFC(useMarkdownPreview);

export {
    MarkdownPreviewModel,
    MarkdownPreviewParams,
    useMarkdownPreview,
    MarkdownPreviewComponent as MarkdownPreview
};
