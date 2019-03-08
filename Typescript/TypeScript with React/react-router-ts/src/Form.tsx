import * as React from "react";

interface IValues {
  [key: string]: any;
}

export type Validator = (
  fieldName: string,
  values: IValues,
  args?: any
) => string;

export const required: Validator = (
  fieldName: string,
  values: IValues,
  args?: any
): string =>
  values[fieldName] === undefined ||
  values[fieldName] === null ||
  values[fieldName] === ""
    ? "this must be populated"
    : "";

export const minLength: Validator = (
  fieldName: string,
  values: IValues,
  length: number
): string =>
  values[fieldName] && values[fieldName].length < length
    ? `This must be at least ${length} characters`
    : "";

interface IValidation {
  validator: Validator;
  arg?: any;
}

interface IValidationProp {
  [key: string]: IValidation | IValidation[];
}

interface IFormProps {
  defaultValues: IValues;
  validationRules?: IValidationProp;
}

interface IErrors {
  [key: string]: string[];
}

interface IState {
  values: IValues;
  errors: IErrors;
}

interface IFieldProps {
  name: string;
  label: string;
  type: "Text" | "Email" | "Select" | "TextArea";
  options?: string[];
}

interface IFormContext {
  values: IValues;
  setValue?: (filedName: string, value: any) => void;
  validate?: (fieldName: string, value: any) => void;
  errors: IErrors;
}
const FormContext = React.createContext<IFormContext>({
  values: {},
  errors: {}
});

export class Form extends React.Component<IFormProps, IState> {
  public constructor(props: IFormProps) {
    super(props);
    const errors: IErrors = {};
    Object.keys(props.defaultValues).forEach(fieldName => {
      errors[fieldName] = [];
    });
    this.state = {
      values: props.defaultValues,
      errors: errors
    };
  }
  public static Field: React.SFC<IFieldProps> = props => {
    const { name, label, type, options } = props;
    const context = React.useContext(FormContext);
    const handleChange = (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>,
      context: IFormContext
    ) => {
      if (context.setValue) {
        context.setValue(props.name, e.currentTarget.value);
      }
    };
    const handleBlur = (
      e:
        | React.FocusEvent<HTMLInputElement>
        | React.FocusEvent<HTMLTextAreaElement>
        | React.FocusEvent<HTMLSelectElement>,
      context: IFormContext
    ) => {
      if (context.validate) {
        context.validate(props.name, e.currentTarget.value);
      }
    };
    return (
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        {(type === "Text" || type === "Email") && (
          <input
            type={type.toLowerCase()}
            id={name}
            value={context.values[name]}
            onChange={e => handleChange(e, context)}
            onBlur={e => handleBlur(e, context)}
          />
        )}
        {type === "TextArea" && (
          <textarea
            id={name}
            value={context.values[name]}
            onChange={e => handleChange(e, context)}
            onBlur={e => handleBlur(e, context)}
          />
        )}
        {type === "Select" && (
          <select
            value={context.values[name]}
            onChange={e => handleChange(e, context)}
            onBlur={e => handleBlur(e, context)}
          >
            {options &&
              options.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </select>
        )}
        {context.errors[name] &&
          context.errors[name].length > 0 &&
          context.errors[name].map(error => (
            <span key={error} className="form-error">
              {error}
            </span>
          ))}
      </div>
    );
  };
  private setValue = (filedName: string, value: any) => {
    const newValues = { ...this.state.values, [filedName]: value };
    this.setState({ values: newValues });
  };
  private validate = (fieldName: string, value: any): string[] => {
    if (!this.props.validationRules) {
      return [];
    }
    const rules = this.props.validationRules[fieldName];
    const errors: string[] = [];
    if (Array.isArray(rules)) {
      rules.forEach(rule => {
        const error = rule.validator(fieldName, this.state.values, rule.arg);
        if (error) {
          errors.push(error);
        }
      });
    } else {
      if (rules) {
        const error = rules.validator(fieldName, this.state.values, rules.arg);
        if (error) {
          errors.push(error);
        }
      }
    }
    const newErrors = { ...this.state.errors, [fieldName]: errors };
    this.setState({ errors: newErrors });
    return errors;
  };
  public render() {
    const context: IFormContext = {
      errors: this.state.errors,
      values: this.state.values,
      setValue: this.setValue,
      validate: this.validate
    };
    return (
      <FormContext.Provider value={context}>
        <form className="form" noValidate={true}>
          {this.props.children}
        </form>
      </FormContext.Provider>
    );
  }
}

Form.Field.defaultProps = {
  type: "Text"
};
