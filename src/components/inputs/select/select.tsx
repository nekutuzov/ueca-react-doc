import * as UECA from "ueca-react";
import { EditBaseModel, EditBaseParams, EditBaseStruct, isEmptyValue, useEditBase } from "@components";
import { Palette, resolvePaletteColor } from "@core";
import "./select.css";

type SelectOption<T = string> = {
    value: T;
    label: string;
    disabled?: boolean;
};

type SelectVariant = "filled" | "outlined" | "standard";
type SelectSize = "small" | "medium";

type SelectStruct<T = string> = EditBaseStruct<{
    props: {
        labelView: React.ReactNode;
        value: T;
        options: SelectOption<T>[];
        placeholder: string;
        disabled: boolean;
        helperTextView: string;
        variant: SelectVariant;
        size: SelectSize;
        required: boolean;
        fullWidth: boolean;
        color: Palette;
    };

    events: {
        onChange: (value: T, source: SelectModel<T>) => UECA.MaybePromise;
        onFocus: (source: SelectModel<T>) => UECA.MaybePromise;
        onBlur: (source: SelectModel<T>) => UECA.MaybePromise;
    };
}>;

type SelectParams<T = string> = EditBaseParams<SelectStruct<T>>;
type SelectModel<T = string> = EditBaseModel<SelectStruct<T>>;

function useSelect<T = string>(params?: SelectParams<T>): SelectModel<T> {
    const struct: SelectStruct<T> = {
        props: {
            id: useSelect.name,
            value: undefined,
            labelView: undefined,
            options: [],
            placeholder: undefined,
            disabled: false,
            helperTextView: undefined,
            variant: "outlined",
            size: "medium",
            required: false,
            fullWidth: true,
            color: "primary.main"
        },

        events: {
            onInternalValidate: async () => {
                // Not `!model.value`: an option whose value is 0 is a choice, and shows as chosen.
                if (model.required && isEmptyValue(model.value)) {
                    return `${UECA.isString(model.labelView) ? model.labelView : "This field"} cannot be empty`;
                }
            },

            onChangeValue: () => model.resetValidationErrors(),
        },

        View: () => {
            const colorClass = resolvePaletteColor(model.color);
            const sizeClass = model.size ? `ueca-select-${model.size}` : "";
            const invalid = !model.isValid();
            const helperShown = invalid || !!model.helperTextView;
            const className = `ueca-select ueca-select-${model.variant} ${sizeClass} ${invalid ? "ueca-select-error" : ""} ${model.disabled ? "ueca-select-disabled" : ""}`.trim();

            return (
                <div
                    id={model.htmlId()}
                    className={className}
                    style={{
                        width: model.fullWidth ? "100%" : model.extent?.width,
                        "--select-color": colorClass
                    } as React.CSSProperties}
                >
                    {model.labelView && (
                        <label htmlFor={_selectId()} className="ueca-select-label">
                            {model.labelView}
                            {model.required && <span className="ueca-select-required" aria-hidden="true"> *</span>}
                        </label>
                    )}
                    <select
                        id={_selectId()}
                        className="ueca-select-input"
                        value={String(model.value)}
                        disabled={model.disabled}
                        required={model.required}
                        aria-invalid={invalid || undefined}
                        aria-describedby={helperShown ? _helperId() : undefined}
                        onChange={_handleChange}
                        onFocus={_handleFocus}
                        onBlur={_handleBlur}
                    >
                        {model.placeholder && (
                            <option value="" disabled>
                                {model.placeholder}
                            </option>
                        )}
                        {model.options.map((option) => (
                            <option
                                key={option.value?.toString()}
                                value={String(option.value)}
                                disabled={option.disabled}
                            >
                                {option.label}
                            </option>
                        ))}
                    </select>
                    {helperShown && (
                        <div id={_helperId()} className={`ueca-select-helper-text ${invalid ? "ueca-select-helper-text-error" : ""}`}>
                            {invalid ? model.getValidationError() : model.helperTextView}
                        </div>
                    )}
                </div>
            );
        },
    };

    const model = useEditBase(struct, params);
    return model;

    // Private methods

    // Derived from the model's DOM id: the label's htmlFor and the select's aria-describedby point at these.
    function _selectId(): string {
        return `${model.htmlId()}-select`;
    }

    function _helperId(): string {
        return `${model.htmlId()}-helper`;
    }

    function _handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const newValue = e.target.value as T;
        // Convert back to number if the original option value was a number
        const option = model.options.find(opt => String(opt.value) === newValue);
        model.value = option ? option.value : newValue;
        if (model.onChange) {
            model.onChange(model.value, model);
        }
    }

    function _handleFocus() {
        if (model.onFocus) {
            model.onFocus(model);
        }
    }

    function _handleBlur() {
        if (model.onBlur) {
            model.onBlur(model);
        }
    }
}

const Select = UECA.getFC(useSelect);

export { SelectModel, SelectOption, SelectParams, SelectVariant, SelectSize, useSelect, Select };