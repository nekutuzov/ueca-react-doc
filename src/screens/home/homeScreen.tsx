import * as UECA from "ueca-react";
import { ScreenBaseModel, ScreenBaseParams, ScreenBaseStruct, useScreenBase, Block, useMarkdownPreview, MarkdownPreviewModel } from "@components";
import { Breadcrumb, CRUDScreenModel, useCRUDScreen } from "@core";
import welcome from "./welcome.md?raw";

type HomeScreenStruct = ScreenBaseStruct<{
    props: {
        page: "welcome";
    };

    children: {
        crudScreen: CRUDScreenModel;
        markdownPreview: MarkdownPreviewModel;
    };
}>;

type HomeScreenParams = ScreenBaseParams<HomeScreenStruct>;
type HomeScreenModel = ScreenBaseModel<HomeScreenStruct>;

function useHomeScreen(params?: HomeScreenParams): HomeScreenModel {
    const struct: HomeScreenStruct = {
        props: {
            id: useHomeScreen.name,
            page: "welcome"
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
                source: () => welcome
            })
        },

        View: () => <model.crudScreen.View />
    };

    const model = useScreenBase(struct, params);
    return model;

    // Private methods
    function _breadCrumbs(): Breadcrumb[] {
        return [
            { route: { path: "/" }, label: "Home" }
        ];
    }
}

const HomeScreen = UECA.getFC(useHomeScreen);

export { HomeScreenModel, useHomeScreen, HomeScreen };

