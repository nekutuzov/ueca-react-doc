import * as UECA from "ueca-react";
import { Row, UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import { AppRoute, ArrowLeftIcon, ArrowRightIcon } from "@core";
import "./docsPager.css";

// Sequential navigation at the foot of an article. The guide is written to be read in order,
// so "what comes next" is part of the content, not decoration - which is also why the first
// and last articles simply render one side.
type DocsPagerStruct = UIBaseStruct<{
    props: {
        prevLabel: string;
        prevPath: string;
        nextLabel: string;
        nextPath: string;
    };

    methods: {
        go: (path: string) => Promise<void>;
    };
}>;

type DocsPagerParams = UIBaseParams<DocsPagerStruct>;
type DocsPagerModel = UIBaseModel<DocsPagerStruct>;

function useDocsPager(params?: DocsPagerParams): DocsPagerModel {
    const struct: DocsPagerStruct = {
        props: {
            id: useDocsPager.name,
            prevLabel: undefined,
            prevPath: undefined,
            nextLabel: undefined,
            nextPath: undefined
        },

        methods: {
            go: async (path) => {
                await model.goToRoute({ path } as AppRoute);
            }
        },

        View: () => {
            if (!model.prevPath && !model.nextPath) {
                return null;
            }
            return (
                <Row id={model.htmlId()} className="docs-pager" spacing={"small"} horizontalAlign={"spaceBetween"}>
                    {model.prevPath
                        ? <button type="button" className="docs-pager-link" onClick={() => model.go(model.prevPath)}>
                            <span className="docs-pager-dir ueca-eyebrow"><ArrowLeftIcon size={13} /> Previous</span>
                            <span className="docs-pager-title">{_breakable(model.prevLabel)}</span>
                        </button>
                        : <span />}
                    {model.nextPath
                        ? <button type="button" className="docs-pager-link docs-pager-next" onClick={() => model.go(model.nextPath)}>
                            <span className="docs-pager-dir ueca-eyebrow">Next <ArrowRightIcon size={13} /></span>
                            <span className="docs-pager-title">{_breakable(model.nextLabel)}</span>
                        </button>
                        : <span />}
                </Row>
            );
        }
    };

    const model = useUIBase(struct, params);
    return model;

    // Private methods

    // "onChanging<Prop>" is a single word to the line breaker, and on a phone it held the next
    // card wider than the pager. A <wbr> before each "<" lets the title break there and nowhere
    // else, so the card needs no more room than "onChanging" alone; the text is unchanged.
    function _breakable(label: string) {
        return label?.split("<").flatMap((part, i) => i === 0 ? [part] : [<wbr key={i} />, "<" + part]);
    }
}

const DocsPager = UECA.getFC(useDocsPager);

export { DocsPagerParams, DocsPagerModel, useDocsPager, DocsPager };
