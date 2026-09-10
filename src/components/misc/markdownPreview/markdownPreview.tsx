
import * as UECA from "ueca-react";
import MarkdownPreview from "@uiw/react-markdown-preview";
import { Col, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import "./markdownPreview.css";

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

        // Every link that leaves the site opens in its own tab, so a reader never loses their
        // place in the guide. Stamped onto the elements rather than handled on click, so the
        // affordance is real - middle-click, the context menu and the status bar all agree - and
        // rel closes the reverse-tabnabbing hole that target="_blank" opens on its own.
        // Synchronous, as draw requires.
        draw: () => {
            const root = document.getElementById(model.htmlId());
            if (!root) {
                return;
            }
            root.querySelectorAll("a[href]").forEach((el) => {
                const a = el as HTMLAnchorElement;
                // A bare "#section" resolves against <base href>, not against the article being
                // read, so every one of them - the two written in the guide and the anchor every
                // heading carries - means /ueca-react-doc/#section, which is Home. Anchoring the
                // href to the current path makes the link honest to the status bar, middle-click
                // and copy-link-address; an ordinary click is taken by the handler in the View,
                // which routes to it so that the jump enters history as a route of its own.
                const rawHref = a.getAttribute("href");
                if (rawHref?.startsWith("#")) {
                    a.setAttribute("href", window.location.pathname + window.location.search + rawHref);
                    a.dataset.section = decodeURIComponent(rawHref.slice(1));
                    return;
                }
                // a.protocol / a.hostname are the RESOLVED values, so this leaves relative
                // article links and mailto: alone without parsing anything.
                const isWeb = a.protocol === "http:" || a.protocol === "https:";
                if (!isWeb || a.hostname === window.location.hostname || a.target === "_blank") {
                    return;
                }
                a.target = "_blank";
                a.rel = "noopener noreferrer";
            });
        },

        View: () => (
            <Col
                id={model.htmlId()}
                className="markdown-host"
                fill
                onClick={async (e: React.MouseEvent) => {
                    const target = e.target as HTMLElement;
                    const anchor = target.closest('a');
                    
                    if (anchor) {
                        // A link to a section of this page: a route with a section, not a scroll.
                        // The router owns the history entry, so Back leaves the section again, and
                        // DocsScreen brings the view to whatever section the route names.
                        const section = anchor.dataset.section;
                        if (section) {
                            e.preventDefault();
                            const route = await model.getRoute();
                            await model.bus.unicast("App.Router.GoToRoute", { ...route, section });
                            return;
                        }

                        const href = anchor.getAttribute('href');
                        const appRoutePath = href ? resolveDocPath(href) : undefined;
                        if (appRoutePath) {
                            // Internal route - use UECA router
                            e.preventDefault();
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

    // Maps a link written inside the packaged markdown to this app's route for the same article.
    // Keyed by file name alone, because the articles link to each other relatively and moved from
    // docs/ to docs/raw/original/ in ueca-react 3.0. Returns undefined for anything not an article,
    // so external links keep the browser's own behaviour.
    function resolveDocPath(rawHref: string): string | undefined {
        const href = decodeURIComponent(rawHref).trim();
        if (!href.toLowerCase().endsWith(".md")) {
            return undefined;
        }
        const fileName = href.split("#")[0].split("?")[0].split("/").pop();
        const docRouteMap: Record<string, string> = {
            "Introduction to UECA-React.md": "/docs/introduction",
            "Technology of UECA-React.md": "/docs/technology",
            "Component Mental Model in UECA-React.md": "/docs/component-mental-model",
            "Component Integration Model in UECA-React.md": "/docs/component-integration-model",
            "Introduction to UECA-React Components.md": "/docs/introduction-to-components",
            "Component IDs in UECA-React.md": "/docs/component-ids",
            "Lifecycle Hooks in UECA-React.md": "/docs/lifecycle-hooks",
            "State Management in UECA-React.md": "/docs/state-management",
            "Property Bindings in UECA-React.md": "/docs/property-bindings",
            "Automatic onChange Events in UECA-React.md": "/docs/onchange-events",
            "Automatic onChanging Events in UECA-React.md": "/docs/onchanging-events",
            "Automatic onPropChange and onPropChanging Events in UECA-React.md": "/docs/onprop-events",
            "Message Bus in UECA-React.md": "/docs/message-bus",
            "Arrays and Reactivity in UECA-React.md": "/docs/arrays-and-reactivity",
            "Model Caching in UECA-React.md": "/docs/model-caching",
            "Component Extension in UECA-React.md": "/docs/component-extension",
            "Specialized Component Factories in UECA-React.md": "/docs/specialized-factories",
            "Tracing in UECA-React.md": "/docs/tracing",
            "Error Handling in UECA-React.md": "/docs/error-handling",
            "Utility Functions in UECA-React.md": "/docs/utility-functions",
            "code-template.md": "/docs/code-template"
        };

        return fileName ? docRouteMap[fileName] : undefined;
    }
}

const MarkdownPreviewComponent = UECA.getFC(useMarkdownPreview);

export {
    MarkdownPreviewModel,
    MarkdownPreviewParams,
    useMarkdownPreview,
    MarkdownPreviewComponent as MarkdownPreview
};
