import * as UECA from "ueca-react";
import { ScreenBaseModel, ScreenBaseParams, ScreenBaseStruct, useScreenBase } from "@components";
import { Breadcrumb, CRUDScreenModel, useCRUDScreen } from "@core";
import { HomeHeroModel, useHomeHero } from "./homeHero/homeHero";

type HomeScreenStruct = ScreenBaseStruct<{
    props: {
        page: "welcome";
    };

    children: {
        crudScreen: CRUDScreenModel;
        hero: HomeHeroModel;
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
                // The hero owns its own measure and rhythm, so the layout adds no padding.
                contentPaddings: "none",
                breadcrumbs: () => _breadCrumbs(),
                contentView: () => <model.hero.View />
            }),

            hero: useHomeHero()
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
