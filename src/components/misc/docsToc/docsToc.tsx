import * as UECA from "ueca-react";
import { UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import "./docsToc.css";

type TocEntry = {
    id: string;
    text: string;
    level: number;
};

// "On this page" for the current article. The entries come from parsing the markdown source,
// not from reading the rendered DOM: the source is already on the model, a string scan is
// synchronous, and it cannot go stale between render and measurement.
type DocsTocStruct = UIBaseStruct<{
    props: {
        source: string;
        heading: string;
        // Deepest heading level to list. 2 keeps it to the article's own sections.
        maxLevel: number;
    };

    methods: {
        entries: () => TocEntry[];
        goTo: (id: string) => void;
    };
}>;

type DocsTocParams = UIBaseParams<DocsTocStruct>;
type DocsTocModel = UIBaseModel<DocsTocStruct>;

function useDocsToc(params?: DocsTocParams): DocsTocModel {
    const struct: DocsTocStruct = {
        props: {
            id: useDocsToc.name,
            source: "",
            heading: "On this page",
            maxLevel: 2
        },

        methods: {
            entries: () => _parse(model.source ?? "", model.maxLevel ?? 2),

            goTo: (id) => {
                // Not an <a href="#id">: this app sets <base href>, against which a bare
                // fragment resolves to the base URL and navigates off the article.
                const target = document.getElementById(id);
                if (!target) {
                    return;
                }
                // Scroll the article's own container rather than calling scrollIntoView, which
                // walks up the ancestors and drags the app shell - top bar and all - off screen.
                const scroller = target.closest(".app-content") as HTMLElement;
                if (!scroller) {
                    target.scrollIntoView({ block: "start" });
                    return;
                }
                // Instant, not smooth: a smooth scroll over this distance is still animating
                // when the next render lands, and the browser abandons it part-way - the jump
                // stops a few hundred pixels short of the heading.
                const delta = target.getBoundingClientRect().top - scroller.getBoundingClientRect().top;
                scroller.scrollTo({ top: scroller.scrollTop + delta - 12 });
            }
        },

        View: () => {
            const entries = model.entries();
            if (!entries.length) {
                return null;
            }
            // A plain <aside>, not a Col: Col writes `display: flex` inline, which outranks the
            // `display: none` this column relies on to drop out on a narrow viewport.
            return (
                <aside id={model.htmlId()} className="docs-toc">
                    <div className="docs-toc-heading ueca-eyebrow">{model.heading}</div>
                    <nav className="docs-toc-list">
                        {entries.map((e) => (
                            <button
                                key={e.id}
                                type="button"
                                className={`docs-toc-link docs-toc-level-${e.level}`}
                                onClick={() => model.goTo(e.id)}
                            >
                                {e.text}
                            </button>
                        ))}
                    </nav>
                </aside>
            );
        }
    };

    const model = useUIBase(struct, params);
    return model;

    // Private methods
    function _parse(source: string, maxLevel: number): TocEntry[] {
        // Fenced blocks are dropped first, so a commented "## " inside an example is not a
        // heading. The h1 is the article title and is already on screen, so listing starts at h2.
        const prose = source.replace(/^```[\s\S]*?^```/gm, "");
        const entries: TocEntry[] = [];
        const seen: Record<string, number> = {};

        for (const line of prose.split("\n")) {
            const match = /^(#{2,6})\s+(.+?)\s*#*\s*$/.exec(line);
            if (!match) {
                continue;
            }
            const level = match[1].length;
            if (level > maxLevel) {
                continue;
            }
            const text = _plainText(match[2]);
            entries.push({ id: _slug(text, seen), text, level });
        }
        return entries;
    }

    // Strips the inline markdown that would otherwise show up as literal punctuation.
    function _plainText(raw: string): string {
        return raw
            .replace(/`([^`]*)`/g, "$1")
            .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
            .replace(/[*_]{1,3}([^*_]+)[*_]{1,3}/g, "$1")
            .trim();
    }

    // Mirrors github-slugger, which is what rehype-slug uses to build the heading ids this
    // links to. Keep the two in step or the jump targets stop resolving.
    function _slug(text: string, seen: Record<string, number>): string {
        const base = text
            .toLowerCase()
            .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,./:;<=>?@[\]^`{|}~]/g, "")
            .replace(/\s/g, "-");
        const count = seen[base] ?? 0;
        seen[base] = count + 1;
        return count ? `${base}-${count}` : base;
    }
}

const DocsToc = UECA.getFC(useDocsToc);

export { TocEntry, DocsTocParams, DocsTocModel, useDocsToc, DocsToc };
