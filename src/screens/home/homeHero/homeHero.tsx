import * as UECA from "ueca-react";
import { Col, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import { AppRoute, ArrowRightIcon, GitHubIcon } from "@core";
import "./homeHero.css";

// The landing page. Its centrepiece is the struct spine below: UECA's whole claim is that every
// component has the same six sections in the same order, so the shape of a component IS the
// pitch. Copy follows src/screens/home/welcome.md.
type HomeHeroStruct = UIBaseStruct<{
    props: {
        version: string;
    };

    methods: {
        go: (path: string) => Promise<void>;
        open: (url: string) => Promise<void>;
    };
}>;

type HomeHeroParams = UIBaseParams<HomeHeroStruct>;
type HomeHeroModel = UIBaseModel<HomeHeroStruct>;

// The fixed order, and what each section answers. This is the signature element - the one place
// the page raises its voice - so everything around it stays quiet.
const SECTIONS: { name: string; role: string }[] = [
    { name: "props", role: "the state it holds" },
    { name: "children", role: "the models it owns" },
    { name: "methods", role: "what it can be asked to do" },
    { name: "events", role: "what it reports upward" },
    { name: "messages", role: "what it answers on the bus" },
    { name: "View", role: "what it draws" }
];

const PRINCIPLES: { title: string; body: string }[] = [
    {
        title: "Automatic onChange events",
        body: "Generated for any property. You declare the property; the event is already there."
    },
    {
        title: "Message bus",
        body: "Update data deep in the tree without prop drilling - just send a message."
    },
    {
        title: "Consistent structure",
        body: "All components look and behave the same, making code easy to read and extend."
    }
];

const DEMOS: { name: string; note: string; demo: string; source: string }[] = [
    {
        name: "MUI Components",
        note: "The component library wrapped in UECA models.",
        demo: "https://nekutuzov.github.io/ueca-react-app-demo1",
        source: "https://github.com/nekutuzov/ueca-react-app-demo1"
    },
    {
        name: "Storybook",
        note: "The same pattern driving an isolated component workshop.",
        demo: "https://nekutuzov.github.io/ueca-react-app-demo2",
        source: "https://github.com/nekutuzov/ueca-react-app-demo2"
    },
    {
        name: "This documentation site",
        note: "Built on UECA-React 3.0, and its own longest-running test.",
        demo: "https://nekutuzov.github.io/ueca-react-doc",
        source: "https://github.com/nekutuzov/ueca-react-doc"
    }
];

function useHomeHero(params?: HomeHeroParams): HomeHeroModel {
    const struct: HomeHeroStruct = {
        props: {
            id: useHomeHero.name,
            version: "3.0"
        },

        methods: {
            go: async (path) => {
                await model.goToRoute({ path } as AppRoute);
            },

            open: async (url) => {
                await model.openNewTab({ path: url } as AppRoute);
            }
        },

        View: () => (
            <Col id={model.htmlId()} className="home" spacing={"none"}>

                {/* ---- Hero ---- */}
                <header className="home-hero">
                    <div className="home-eyebrow ueca-eyebrow">UECA-React {model.version}</div>
                    <h1 className="home-headline">
                        Write React simply<br />and predictably.
                    </h1>
                    <p className="home-lead">
                        UECA-React brings order and clarity to your React codebase. Every component follows
                        the exact same structure. No chaos, no scattered hooks, no long arrow functions.
                    </p>
                    <div className="home-actions">
                        <button type="button" className="home-btn home-btn-primary" onClick={() => model.go("/docs/introduction")}>
                            Read the guide <ArrowRightIcon size={15} />
                        </button>
                        <button type="button" className="home-btn" onClick={() => model.open("https://github.com/nekutuzov/ueca-react-doc")}>
                            <GitHubIcon size={15} /> GitHub
                        </button>
                    </div>
                </header>

                {/* ---- The signature: one component, always this shape ---- */}
                <section className="home-spine-block" aria-label="The shape of a UECA component">
                    <div className="home-spine-caption ueca-eyebrow">Every component, this exact shape</div>
                    <ol className="home-spine">
                        {SECTIONS.map((s, i) => (
                            <li
                                key={s.name}
                                className={`home-spine-row${i === 0 ? " is-first" : ""}${i === SECTIONS.length - 1 ? " is-last" : ""}`}
                            >
                                <span className="home-spine-name">{s.name}</span>
                                <span className="home-spine-role">{s.role}</span>
                            </li>
                        ))}
                    </ol>
                    <p className="home-spine-note">
                        Read one UECA component and you can read them all - the order never changes.
                    </p>
                </section>

                {/* ---- Principles ---- */}
                <section className="home-section">
                    <h2 className="home-h2">Key principles</h2>
                    <div className="home-grid">
                        {PRINCIPLES.map((p) => (
                            <article key={p.title} className="home-card">
                                <h3 className="home-card-title">{p.title}</h3>
                                <p className="home-card-body">{p.body}</p>
                            </article>
                        ))}
                    </div>
                </section>

                {/* ---- Why ---- */}
                <section className="home-section home-prose">
                    <h2 className="home-h2">Why UECA-React?</h2>
                    <p>
                        After years of seeing how messy and unpredictable real React code becomes, I created
                        this pattern to fix it. Different screens looked completely different, understanding
                        someone else&rsquo;s code was painful, and adding new features turned into a nightmare.
                    </p>
                    <p>
                        UECA-React gives you clear rails that both humans and AI can follow. The structure is
                        100% consistent across all components, so an assistant picks up the pattern almost
                        immediately and generates new screens with very few mistakes.
                    </p>
                </section>

                {/* ---- Demos ---- */}
                <section className="home-section">
                    <h2 className="home-h2">Live demos</h2>
                    <ul className="home-demos">
                        {DEMOS.map((d) => (
                            <li key={d.name} className="home-demo">
                                <div className="home-demo-text">
                                    <span className="home-demo-name">{d.name}</span>
                                    <span className="home-demo-note">{d.note}</span>
                                </div>
                                <div className="home-demo-links">
                                    <button type="button" className="home-btn home-btn-sm" onClick={() => model.open(d.demo)}>
                                        Open demo
                                    </button>
                                    <button type="button" className="home-btn home-btn-sm" onClick={() => model.open(d.source)}>
                                        Source
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </section>
            </Col>
        )
    };

    const model = useUIBase(struct, params);
    return model;
}

const HomeHero = UECA.getFC(useHomeHero);

export { HomeHeroParams, HomeHeroModel, useHomeHero, HomeHero };
