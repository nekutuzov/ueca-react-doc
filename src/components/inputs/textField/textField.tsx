import * as UECA from "ueca-react";
import { EditBaseModel, EditBaseParams, EditBaseStruct, isEmptyValue, useEditBase } from "@components";
import { Palette, resolvePaletteColor } from "@core";
import "./textField.css";

type TextFieldType = "text" | "email" | "password" | "number" | "tel" | "url" | "search";
type TextFieldVariant = "outlined" | "filled" | "standard";

type TextFieldStruct<T = string> = EditBaseStruct<{
    props: {
        value: T;
        labelView: React.ReactNode;
        placeholder: string;
        type: TextFieldType;
        disabled: boolean;
        required: boolean;
        error: boolean;
        helperTextView: React.ReactNode;
        variant: TextFieldVariant;
        fullWidth: boolean;
        multiline: boolean;
        rows: number;
        autoComplete: string;
        color: Palette;
    };

    events: {
        onChange: (value: T, source: TextFieldModel<T>) => UECA.MaybePromise;
        onFocus: (source: TextFieldModel<T>) => UECA.MaybePromise;
        onBlur: (source: TextFieldModel<T>) => UECA.MaybePromise;
    };
}>;

type TextFieldParams<T = string> = EditBaseParams<TextFieldStruct<T>>;
type TextFieldModel<T = string> = EditBaseModel<TextFieldStruct<T>>;

function useTextField<T = string>(params?: TextFieldParams<T>): TextFieldModel<T> {
    const struct: TextFieldStruct<T> = {
        props: {
            id: useTextField.name,
            value: undefined,
            labelView: undefined,
            placeholder: "",
            type: "text",
            disabled: false,
            required: false,
            error: false,
            helperTextView: undefined,
            variant: "outlined",
            fullWidth: true,
            multiline: false,
            rows: 1,
            autoComplete: undefined,
            color: "primary.main"
        },

        events: {
            onInternalValidate: async () => {
                const fieldName = UECA.isString(model.labelView) ? model.labelView : "This field";
                
                // Required validation. A TextField<number> holding 0 shows "0", so 0 is not empty.
                if (model.required && isEmptyValue(model.value)) {
                    return `${fieldName} is required`;
                }

                // Type-specific validation (only if value is not empty)
                if (!isEmptyValue(model.value)) {
                    const valueStr = model.value.toString();
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    const phoneRegex = /^[\d\s\-+()]+$/;

                    switch (model.type) {
                        case "email":                    
                            if (!emailRegex.test(valueStr)) {
                                return `${fieldName} must be a valid email address`;
                            }
                            break;

                        case "url":
                            try {
                                new URL(valueStr);
                            } catch {
                                return `${fieldName} must be a valid URL (e.g., https://example.com)`;
                            }
                            break;

                        case "tel":                            
                            if (!phoneRegex.test(valueStr)) {
                                return `${fieldName} must be a valid phone number`;
                            }
                            break;

                        case "number":
                            if (isNaN(Number(valueStr))) {
                                return `${fieldName} must be a valid number`;
                            }
                            break;
                    }
                }
            },

            onChangeValue: () => model.resetValidationErrors(),
        },

        View: () => {
            const colorClass = resolvePaletteColor(model.color);
            const hasValidationError = !model.isValid();
            const hasExternalError = model.error;
            const showError = hasValidationError || hasExternalError;
            const helperShown = showError || !!model.helperTextView;
            const errorMessage = hasValidationError ? model.getValidationError() : model.helperTextView;

            const className = `ueca-textfield ueca-textfield-${model.variant}${showError ? " ueca-textfield-error" : ""}${model.disabled ? " ueca-textfield-disabled" : ""}${model.fullWidth ? " ueca-textfield-fullwidth" : ""}`;

            return (
                <div
                    id={model.htmlId()}
                    className={className}
                    style={{
                        "--textfield-color": colorClass
                    } as React.CSSProperties}
                >
                    {model.labelView && (
                        <label htmlFor={_inputId()} className="textfield-label">
                            {model.labelView}
                            {model.required && <span className="textfield-required" aria-hidden="true"> *</span>}
                        </label>
                    )}
                    {model.multiline ? (
                        <textarea
                            id={_inputId()}
                            className="textfield-input textfield-textarea"
                            // Never undefined: value={undefined} makes React treat the field as
                            // uncontrolled, and an uncontrolled field keeps the text it last
                            // showed when its value is unset again (a reloaded record, a null).
                            value={model.value?.toString() ?? ""}
                            placeholder={model.placeholder}
                            disabled={model.disabled}
                            required={model.required}
                            aria-invalid={showError || undefined}
                            aria-describedby={helperShown ? _helperId() : undefined}
                            rows={model.rows}
                            onChange={_handleChange}
                            onFocus={_handleFocus}
                            onBlur={_handleBlur}
                        />
                    ) : (
                        <input
                            id={_inputId()}
                            className="textfield-input"
                            type={model.type}
                            // Never undefined, for the same reason as the textarea's.
                            value={model.value?.toString() ?? ""}
                            placeholder={model.placeholder}
                            disabled={model.disabled}
                            required={model.required}
                            aria-invalid={showError || undefined}
                            aria-describedby={helperShown ? _helperId() : undefined}
                            autoComplete={model.autoComplete}
                            onChange={_handleChange}
                            onFocus={_handleFocus}
                            onBlur={_handleBlur}
                        />
                    )}
                    {helperShown && (
                        <div id={_helperId()} className={`textfield-helper-text${showError ? " textfield-helper-text-error" : ""}`}>
                            {errorMessage}
                        </div>
                    )}
                </div>
            );
        }
    };

    const model = useEditBase(struct, params);
    return model;

    // Private methods

    // Derived from the model's DOM id: the label's htmlFor and the input's aria-describedby point at these.
    function _inputId(): string {
        return `${model.htmlId()}-input`;
    }

    function _helperId(): string {
        return `${model.htmlId()}-helper`;
    }

    function _handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        model.value = e.target.value as T;
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

const TextField = UECA.getFC(useTextField);

export { TextFieldModel, TextFieldParams, TextFieldType, TextFieldVariant, useTextField, TextField };
