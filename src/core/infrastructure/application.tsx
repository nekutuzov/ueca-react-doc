import * as UECA from "ueca-react";
import { UIBaseModel, UIBaseParams, UIBaseStruct, useUIBase } from "@components";
import {
    AppBrowsingHistoryModel,
    useAppBrowsingHistory,
    AppThemeManagerModel,
    useAppThemeManager,
    AppUIModel,
    useAppUI,
} from "@core";

type ApplicationStruct = UIBaseStruct<{
    props: {
        applicationName: string;
        appVersion: string;
    },

    children: {
        themeManager: AppThemeManagerModel;
        browsingHistory: AppBrowsingHistoryModel;
        ui: AppUIModel;
    }
}>;

type ApplicationParams = UIBaseParams<ApplicationStruct>;
type ApplicationModel = UIBaseModel<ApplicationStruct>;

function useApplication(params?: ApplicationParams): ApplicationModel {
    const struct: ApplicationStruct = {
        props: {
            id: useApplication.name,
            applicationName: undefined,
            appVersion: undefined
        },

        children: {
            // First: it resolves the active theme in constr, and the shell reads the mode as it
            // builds.
            themeManager: useAppThemeManager(),
            browsingHistory: useAppBrowsingHistory(),
            ui: useAppUI()
        },

        messages: {
            "App.GetInfo": async () => {
                return {
                    appName: model.applicationName,
                    appVersion: model.appVersion
                }
            }
        },
        
        View: () => <model.ui.View />
    };

    const model = useUIBase(struct, params);
    return model;
}

const Application = UECA.getFC(useApplication);

export { ApplicationModel, useApplication, Application };
